
import os
import json
import logging
import time
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Request, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Database Configuration for Google Cloud SQL ---
# Uses INSTANCE_CONNECTION_NAME if present for Unix socket connection
if os.getenv("INSTANCE_CONNECTION_NAME"):
    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")
    DB_NAME = os.getenv("DB_NAME")
    INSTANCE_CONNECTION_NAME = os.getenv("INSTANCE_CONNECTION_NAME")
    # socket path usually /cloudsql/INSTANCE_CONNECTION_NAME
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@/{DB_NAME}?host=/cloudsql/{INSTANCE_CONNECTION_NAME}"
else:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/nhfg_db")

PORT = int(os.getenv("PORT", 3001))
SECRET_KEY = os.getenv("SECRET_KEY", "your_super_secret_key_change_this_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200 # 30 days

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NHFG-API")

app = FastAPI(title="New Holland Financial Group API")

# Security Context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Security: Rate Limiting (In-Memory) ---
rate_limit_store = defaultdict(list)

async def rate_limiter(request: Request):
    # Allow 100 requests per minute per IP
    client_ip = request.client.host
    now = time.time()
    # Filter out timestamps older than 60 seconds
    rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if now - t < 60]
    
    if len(rate_limit_store[client_ip]) >= 100:
        logger.warning(f"Rate limit exceeded for {client_ip}")
        raise HTTPException(status_code=429, detail="Too Many Requests")
    
    rate_limit_store[client_ip].append(now)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# --- Database Pool ---
@app.on_event("startup")
async def startup():
    logger.info(f"Connecting to database: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else '...'}")
    app.state.pool = await asyncpg.create_pool(DATABASE_URL)

@app.on_event("shutdown")
async def shutdown():
    await app.state.pool.close()

# --- WebSocket Manager (Real-time Sync) ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"WS Broadcast error: {e}")

manager = ConnectionManager()

# --- Models ---
class LeadInput(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    interest: Optional[str] = None
    status: Optional[str] = "New"
    source: Optional[str] = None
    assignedTo: Optional[str] = None
    message: Optional[str] = None
    lifeDetails: Optional[Dict[str, Any]] = None
    realEstateDetails: Optional[Dict[str, Any]] = None
    securitiesDetails: Optional[Dict[str, Any]] = None
    customDetails: Optional[Dict[str, Any]] = None

class LoginInput(BaseModel):
    email: str
    password: str

# --- Helpers ---
def verify_password(plain_password, hashed_password):
    if not hashed_password:
        return False
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return email

def normalize_webhook(platform: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    if platform == 'google':
        fields = {}
        if 'user_column_data' in payload:
            for col in payload['user_column_data']:
                fields[col['column_id']] = col['string_value']
        full_name = fields.get('FULL_NAME') or f"{fields.get('FIRST_NAME', '')} {fields.get('LAST_NAME', '')}".strip()
        return {
            "name": full_name or "Google Lead",
            "email": fields.get('EMAIL', "Not Provided"),
            "phone": fields.get('PHONE_NUMBER', "N/A"),
            "interest": fields.get('PRODUCT_INTEREST', "Life Insurance"),
            "campaign_id": payload.get('campaign_id'),
            "source": "google_ads"
        }
    elif platform == 'meta':
        entry = payload.get('entry', [{}])[0]
        change = entry.get('changes', [{}])[0].get('value', payload)
        field_map = {}
        if 'field_data' in change:
            for f in change['field_data']:
                if f.get('values'):
                    field_map[f['name']] = f['values'][0]
        return {
            "name": field_map.get('full_name') or change.get('full_name') or "Meta Lead",
            "email": field_map.get('email') or change.get('email') or "Not Provided",
            "phone": field_map.get('phone_number') or change.get('phone_number') or "N/A",
            "interest": field_map.get('job_title') or "Business Insurance",
            "campaign_id": change.get('campaign_id'),
            "source": "meta_ads"
        }
    elif platform == 'tiktok':
        data = payload.get('data', {})
        details = data.get('details', {})
        return {
            "name": details.get('name', "TikTok Lead"),
            "email": details.get('email', "Not Provided"),
            "phone": details.get('phone', "N/A"),
            "interest": "Indexed Universal Life (IUL)",
            "campaign_id": data.get('campaign_id'),
            "source": "tiktok_ads"
        }
    raise ValueError("Unsupported platform")

# --- Routes ---

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            # Broadcast to all (Real-time Chat / Sync)
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/dashboard/metrics", dependencies=[Depends(rate_limiter)])
async def get_metrics(current_user: str = Depends(get_current_user)):
    pool = app.state.pool
    async with pool.acquire() as conn:
        rev_row = await conn.fetchrow("SELECT SUM(premium) as total FROM clients")
        clients_row = await conn.fetchrow("SELECT COUNT(*) as count FROM clients")
        leads_row = await conn.fetchrow("SELECT COUNT(*) as count FROM leads WHERE status = 'New'")
        
        return {
            "totalRevenue": float(rev_row['total'] or 0),
            "activeClients": int(clients_row['count']),
            "pendingLeads": int(leads_row['count']),
            "monthlyPerformance": [
                { "month": 'Jan', "revenue": 45000, "leads": 24 },
                { "month": 'Feb', "revenue": 52000, "leads": 30 },
                { "month": 'Mar', "revenue": 48000, "leads": 28 },
            ]
        }

@app.get("/api/leads", dependencies=[Depends(rate_limiter)])
async def get_leads(advisorId: Optional[str] = None, current_user: str = Depends(get_current_user)):
    pool = app.state.pool
    query = "SELECT * FROM leads WHERE is_archived = false"
    args = []
    if advisorId:
        query += " AND (assigned_to = $1 OR assigned_to IS NULL)"
        args.append(advisorId)
    query += " ORDER BY created_at DESC"
    async with pool.acquire() as conn:
        rows = await conn.fetch(query, *args)
    return [
        {
            "id": str(row['id']),
            "name": row['name'],
            "email": row['email'],
            "phone": row['phone'],
            "interest": row['interest'],
            "status": row['status'],
            "assignedTo": str(row['assigned_to']) if row['assigned_to'] else None,
            "source": row['source'],
            "priority": row['priority'],
            "score": row['score'],
            "qualification": row['qualification'],
            "message": row['message'],
            "date": row['created_at'].isoformat(),
            "lifeDetails": json.loads(row['life_details']) if row['life_details'] else None,
            "realEstateDetails": json.loads(row['real_estate_details']) if row['real_estate_details'] else None,
            "securitiesDetails": json.loads(row['securities_details']) if row['securities_details'] else None,
            "customDetails": json.loads(row['custom_details']) if row['custom_details'] else None
        }
        for row in rows
    ]

@app.post("/api/leads", dependencies=[Depends(rate_limiter)])
async def create_lead(lead: LeadInput, current_user: str = Depends(get_current_user)):
    pool = app.state.pool
    query = """
        INSERT INTO leads (
            name, email, phone, interest, status, source, assigned_to, message, 
            life_details, real_estate_details, securities_details, custom_details
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
    """
    assigned_to = lead.assignedTo if lead.assignedTo else None
    async with pool.acquire() as conn:
        try:
            row = await conn.fetchrow(query, 
                lead.name, lead.email, lead.phone, lead.interest, 
                lead.status, lead.source, assigned_to, lead.message,
                json.dumps(lead.lifeDetails) if lead.lifeDetails else None,
                json.dumps(lead.realEstateDetails) if lead.realEstateDetails else None,
                json.dumps(lead.securitiesDetails) if lead.securitiesDetails else None,
                json.dumps(lead.customDetails) if lead.customDetails else None
            )
            # Broadcast new lead event via WebSocket
            await manager.broadcast({
                "type": "NEW_LEAD",
                "payload": { "id": str(row['id']), "name": lead.name, "interest": lead.interest }
            })
            return {"id": str(row['id']), "success": True}
        except Exception as e:
            logger.error(f"Failed to create lead: {e}")
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/webhooks/{platform}")
async def webhook_ingest(platform: str, request: Request):
    payload = await request.json()
    pool = app.state.pool
    logger.info(f"Received {platform} webhook")
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO integration_logs (platform, event_type, status, payload) VALUES ($1, $2, $3, $4)",
            platform, 'INGEST_ATTEMPT', 'pending', json.dumps(payload)
        )
        try:
            lead_data = normalize_webhook(platform, payload)
            row = await conn.fetchrow(
                """
                INSERT INTO leads (name, email, phone, interest, source, campaign_id, status, platform_data, message)
                VALUES ($1, $2, $3, $4, $5, $6, 'New', $7, 'Auto-Imported via Webhook')
                RETURNING id
                """,
                lead_data['name'], lead_data['email'], lead_data['phone'], 
                lead_data['interest'], lead_data['source'], lead_data.get('campaign_id'),
                json.dumps(payload)
            )
            # Real-time alert
            await manager.broadcast({
                "type": "NEW_LEAD",
                "payload": { "id": str(row['id']), "name": lead_data['name'], "source": platform }
            })
            return {"success": True, "message": "Lead normalized and ingested"}
        except Exception as e:
            logger.error(f"Webhook Error: {e}")
            await conn.execute(
                "INSERT INTO integration_logs (platform, event_type, status, error_message) VALUES ($1, $2, $3, $4)",
                platform, 'INGEST_ERROR', 'failure', str(e)
            )
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login", dependencies=[Depends(rate_limiter)])
async def login(creds: LoginInput):
    pool = app.state.pool
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL", creds.email)
        
        if not row:
            raise HTTPException(status_code=401, detail="User not found")
            
        # Verify Password
        valid_password = False
        if row['password_hash']:
            valid_password = verify_password(creds.password, row['password_hash'])
        else:
            # Fallback for dev/demo users initialized without hashes (legacy support)
            # In Production, enforce password_hash IS NOT NULL check
            if creds.password == "password" or creds.password == "demo123":
                valid_password = True
        
        if valid_password:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": row['email'], "id": str(row['id']), "role": row['role']},
                expires_delta=access_token_expires
            )
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": str(row['id']),
                    "name": row['name'],
                    "email": row['email'],
                    "role": row['role'],
                    "category": row['category'],
                    "avatar": row['avatar'],
                    "productsSold": row['products_sold']
                }
            }
        
        raise HTTPException(status_code=401, detail="Invalid credentials")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
