<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1P2js4PUsdgOm-TX4yzWuuDehni639uyg

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend + Database (Full Stack)

### Option A: Docker Compose (recommended)
1. Start Postgres + API:
   `docker compose up --build`

The database schema is applied automatically on first boot. The API will be
available at `http://localhost:3001`, with a health check at
`http://localhost:3001/api/health`.
Seed data is also loaded automatically for development.
Core endpoints: `/api/leads`, `/api/clients`, `/api/users`, `/api/settings`,
`/api/integration-logs`, `/api/dashboard/metrics`.

### Option B: Run locally without Docker
1. Install backend dependencies:
   `cd backend && npm install`
2. Copy the environment template and update the database URL:
   `cp .env.example .env`
3. Create the database and apply the schema:
   `psql "$DATABASE_URL" -f schema.sql`
4. (Optional) Load development seed data:
   `psql "$DATABASE_URL" -f seed.sql`
5. Start the API server:
   `npm run dev`
