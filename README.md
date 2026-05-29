# UAF Campus Portal — IntelliChat

University of Agriculture Faisalabad — Full-stack campus intelligence portal with a menu-based chatbot, interactive map, events calendar and admin dashboard.

## Project Structure

```
UAF Website/
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/   # ChatWindow, MapView, Navbar, Footer
│   │   ├── pages/        # Home, Chat, Map, Events, Admin, Login
│   │   ├── hooks/        # useAuth
│   │   ├── utils/        # api.js (axios)
│   │   └── styles/       # index.css
│   ├── public/           # uaf-logo.png, static assets
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/           # Python FastAPI + SQLAlchemy + Neon PostgreSQL
    ├── app/
    │   ├── main.py        # FastAPI entry point
    │   ├── database.py    # Async SQLAlchemy engine
    │   ├── models/        # SQLAlchemy ORM models
    │   ├── routers/       # menu, events, users, admin
    │   └── services/      # auth (JWT + bcrypt)
    ├── alembic/           # Database migrations
    ├── requirements.txt
    └── .env.example
```

## Setup — Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and set your Neon DATABASE_URL and SECRET_KEY

# Run Alembic migrations (creates tables + seeds data)
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

**Default Admin Credentials:**
- Email: `admin@uaf.edu.pk`
- Password: `admin123`

## Setup — Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend: http://localhost:5173

The Vite dev server proxies `/api` → `http://localhost:8000` automatically.

## Features

- **IntelliChat** — Menu-based smart chatbot. Students tap buttons to navigate a two-level menu tree and get pre-written answers. All content managed via admin panel.
- **Campus Map** — Leaflet map with 13 UAF location markers, category filters, search, satellite toggle and geolocation.
- **Events** — Filterable event cards fetched from the database.
- **Admin Dashboard** — Protected route. Stats, charts (Recharts), menu manager, answers editor, student query tracker and CSV export.
- **Authentication** — JWT-based login/register. Admin and student roles.

## Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Student and admin accounts |
| `menu_items` | Two-level menu tree |
| `menu_answers` | Pre-written answers for leaf nodes |
| `events` | Campus events |
| `admin_queries` | Student-escalated queries |
| `chat_sessions` | Interaction tracking |

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```
DATABASE_URL=postgresql://...neon.tech/neondb
SECRET_KEY=your-32+-char-secret
CORS_ORIGINS=http://localhost:5173
```
