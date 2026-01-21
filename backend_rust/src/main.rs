
use axum::{
    extract::{Path, Query, State, FromRequestParts},
    http::{Method, StatusCode, request::Parts},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
    RequestPartsExt,
};
use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use chrono::{Utc, Duration};

#[derive(Clone)]
struct AppState {
    pool: PgPool,
    jwt_secret: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    id: String,
    role: String,
    exp: usize,
}

// Extractor to verify JWT on protected routes
struct Auth(Claims);

#[axum::async_trait]
impl FromRequestParts<AppState> for Auth {
    type Rejection = (StatusCode, Json<Value>);

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|_| (StatusCode::UNAUTHORIZED, Json(json!({"error": "Missing bearer token"}))))?;

        let token_data = decode::<Claims>(
            bearer.token(),
            &DecodingKey::from_secret(state.jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| (StatusCode::UNAUTHORIZED, Json(json!({"error": "Invalid token"}))))?;

        Ok(Auth(token_data.claims))
    }
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let jwt_secret = env::var("SECRET_KEY").unwrap_or_else(|_| "your_super_secret_key".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "3001".to_string());

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    let app_state = AppState { pool, jwt_secret };

    let app = Router::new()
        .route("/api/dashboard/metrics", get(get_metrics))
        .route("/api/leads", get(get_leads).post(create_lead))
        .route("/api/webhooks/:platform", post(webhook_handler))
        .route("/api/auth/login", post(login_handler))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
                .allow_headers(Any),
        )
        .with_state(app_state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port.parse().unwrap()));
    println!("NHFG Rust Backend listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// --- Metrics ---
async fn get_metrics(_: Auth, State(state): State<AppState>) -> impl IntoResponse {
    let rev_row: (Option<f64>,) = sqlx::query_as("SELECT SUM(premium) FROM clients")
        .fetch_one(&state.pool).await.unwrap_or((Some(0.0),));
    
    let clients_row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM clients")
        .fetch_one(&state.pool).await.unwrap_or((0,));
        
    let leads_row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM leads WHERE status = 'New'")
        .fetch_one(&state.pool).await.unwrap_or((0,));

    let response = json!({
        "totalRevenue": rev_row.0.unwrap_or(0.0),
        "activeClients": clients_row.0,
        "pendingLeads": leads_row.0,
        "monthlyPerformance": [
            { "month": "Jan", "revenue": 45000, "leads": 24 },
            { "month": "Feb", "revenue": 52000, "leads": 30 },
            { "month": "Mar", "revenue": 48000, "leads": 28 },
        ]
    });

    Json(response)
}

// --- Leads ---
#[derive(Debug, Serialize, sqlx::FromRow)]
struct Lead {
    id: Uuid,
    name: String,
    email: Option<String>,
    phone: Option<String>,
    interest: Option<String>,
    status: Option<String>,
    #[sqlx(rename = "assigned_to")]
    assigned_to: Option<Uuid>,
    source: Option<String>,
    priority: Option<String>,
    score: Option<i32>,
    qualification: Option<String>,
    message: Option<String>,
    #[sqlx(rename = "created_at")]
    date: Option<chrono::DateTime<chrono::Utc>>,
    #[sqlx(rename = "life_details")]
    life_details: Option<Value>,
    #[sqlx(rename = "real_estate_details")]
    real_estate_details: Option<Value>,
    #[sqlx(rename = "securities_details")]
    securities_details: Option<Value>,
    #[sqlx(rename = "custom_details")]
    custom_details: Option<Value>,
}

#[derive(Deserialize)]
struct GetLeadsQuery {
    advisorId: Option<String>,
}

async fn get_leads(
    _: Auth,
    State(state): State<AppState>,
    Query(params): Query<GetLeadsQuery>,
) -> impl IntoResponse {
    let mut query = "SELECT * FROM leads WHERE is_archived = false".to_string();
    
    if let Some(adv_id) = params.advisorId {
        query.push_str(&format!(" AND (assigned_to = '{}' OR assigned_to IS NULL)", adv_id));
    }
    
    query.push_str(" ORDER BY created_at DESC");

    let leads = sqlx::query_as::<_, Lead>(&query)
        .fetch_all(&state.pool)
        .await
        .unwrap_or(vec![]);

    // Transform for frontend camelCase expectations
    let json_leads: Vec<Value> = leads.into_iter().map(|l| {
        json!({
            "id": l.id,
            "name": l.name,
            "email": l.email,
            "phone": l.phone,
            "interest": l.interest,
            "status": l.status,
            "assignedTo": l.assigned_to,
            "source": l.source,
            "priority": l.priority,
            "score": l.score,
            "qualification": l.qualification,
            "message": l.message,
            "date": l.date,
            "lifeDetails": l.life_details,
            "realEstateDetails": l.real_estate_details,
            "securitiesDetails": l.securities_details,
            "customDetails": l.custom_details
        })
    }).collect();

    Json(json_leads)
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateLeadInput {
    name: String,
    email: Option<String>,
    phone: Option<String>,
    interest: Option<String>,
    status: Option<String>,
    source: Option<String>,
    assigned_to: Option<String>,
    message: Option<String>,
    life_details: Option<Value>,
    real_estate_details: Option<Value>,
    securities_details: Option<Value>,
    custom_details: Option<Value>,
}

async fn create_lead(
    _: Auth,
    State(state): State<AppState>,
    Json(payload): Json<CreateLeadInput>,
) -> impl IntoResponse {
    let assigned_uuid = payload.assigned_to.and_then(|id| Uuid::parse_str(&id).ok());

    let result = sqlx::query!(
        r#"
        INSERT INTO leads (
            name, email, phone, interest, status, source, assigned_to, message, 
            life_details, real_estate_details, securities_details, custom_details
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
        "#,
        payload.name, payload.email, payload.phone, payload.interest,
        payload.status.unwrap_or("New".to_string()), payload.source, assigned_uuid, payload.message,
        payload.life_details, payload.real_estate_details, payload.securities_details, payload.custom_details
    )
    .fetch_one(&state.pool)
    .await;

    match result {
        Ok(rec) => (StatusCode::CREATED, Json(json!({ "id": rec.id, "success": true }))),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))),
    }
}

// --- Webhooks ---
async fn webhook_handler(
    Path(platform): Path<String>,
    State(state): State<AppState>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    // 1. Log Raw
    let _ = sqlx::query!(
        "INSERT INTO integration_logs (platform, event_type, status, payload) VALUES ($1, $2, $3, $4)",
        platform, "INGEST_ATTEMPT", "pending", payload
    ).execute(&state.pool).await;

    // 2. Normalize (Simplified logic for Rust example)
    let (name, email, phone, interest) = match platform.as_str() {
        "google" => (
            payload.get("user_column_data").and_then(|v| v[0].get("string_value")).and_then(|v| v.as_str()).unwrap_or("Google Lead"),
            "Not Provided", "N/A", "Life Insurance"
        ),
        "meta" => ("Meta Lead", "Not Provided", "N/A", "Business Insurance"),
        "tiktok" => ("TikTok Lead", "Not Provided", "N/A", "IUL"),
        _ => return (StatusCode::BAD_REQUEST, Json(json!({"error": "Unsupported platform"}))),
    };

    // 3. Insert
    let res = sqlx::query!(
        r#"
        INSERT INTO leads (name, email, phone, interest, source, status, message, platform_data)
        VALUES ($1, $2, $3, $4, $5, 'New', 'Auto-Imported via Webhook', $6)
        "#,
        name, email, phone, interest, format!("{}_ads", platform), payload
    ).execute(&state.pool).await;

    match res {
        Ok(_) => (StatusCode::OK, Json(json!({ "success": true, "message": "Lead ingested" }))),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))),
    }
}

// --- Auth ---
#[derive(Deserialize)]
struct LoginInput {
    email: String,
    password: Option<String>,
}

async fn login_handler(
    State(state): State<AppState>,
    Json(payload): Json<LoginInput>,
) -> impl IntoResponse {
    let result = sqlx::query!(
        "SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL",
        payload.email
    )
    .fetch_optional(&state.pool)
    .await;

    match result {
        Ok(Some(user)) => {
            let expiration = Utc::now()
                .checked_add_signed(Duration::days(30))
                .expect("valid timestamp")
                .timestamp();

            let claims = Claims {
                sub: user.email.clone(),
                id: user.id.to_string(),
                role: user.role.clone(),
                exp: expiration as usize,
            };

            let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(state.jwt_secret.as_bytes()))
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
                .unwrap();

            Json(json!({
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "category": user.category,
                    "avatar": user.avatar,
                    "productsSold": user.products_sold
                }
            })).into_response()
        },
        Ok(None) => (StatusCode::UNAUTHORIZED, Json(json!({ "error": "User not found" }))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e.to_string() }))).into_response(),
    }
}
