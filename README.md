<p align="center">
  <img src="https://img.shields.io/badge/CyberGuard_AI-National_Cyber_Crime_Complaint_System-1a365d?style=for-the-badge&logo=shield&logoColor=white" alt="CyberGuard AI">
</p>

<h1 align="center">🛡️ CyberGuard AI</h1>

<p align="center">
  <strong>Multilingual AI-Powered Cyber Crime Complaint System</strong><br>
  File, track, and manage cyber crime complaints in 23 Indian languages with AI assistance.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Guided complaint filing through conversational AI (powered by Google Gemini) |
| 🌐 **23 Languages** | Full support for all scheduled Indian languages including Hindi, Tamil, Bengali, Telugu, etc. |
| 🎙️ **Voice Input** | Speech-to-text for hands-free complaint filing |
| 📝 **Smart Forms** | Auto-filled complaint forms based on AI conversation |
| 🔍 **Complaint Tracking** | Track complaint status using ticket ID (`CGAI-YYYYMMDD-XXXX`) |
| 🛡️ **Admin Dashboard** | Secure admin panel to review, manage, and update complaint statuses |
| 📎 **Evidence Upload** | Upload evidence files with AI-powered text extraction |
| 📧 **Email Notifications** | Automatic email confirmations to users and admins via SMTP |
| 🔒 **JWT Authentication** | Secure admin access with JWT-based auth |

---

## 🏗️ Architecture

```
guardia-lingua/
├── backend/              # FastAPI Python backend
│   ├── main.py           # Application entry point
│   ├── config.py         # Pydantic settings (reads .env)
│   ├── database.py       # SQLAlchemy engine & session
│   ├── models/           # SQLAlchemy ORM models
│   │   ├── user.py       # User model
│   │   ├── complaint.py  # Complaint model
│   │   ├── evidence.py   # Evidence attachments
│   │   ├── admin.py      # Admin model
│   │   └── conversation.py # Chat session model
│   ├── routes/           # API route handlers
│   │   ├── chat.py       # AI chat endpoint
│   │   ├── complaint.py  # Complaint CRUD + file upload
│   │   ├── admin.py      # Admin login & management
│   │   └── ai.py         # Language detection, translation, STT/TTS
│   ├── services/         # Business logic layer
│   │   ├── gemini_service.py      # Google Gemini AI integration
│   │   ├── translation_service.py # Translation via Gemini
│   │   ├── complaint_service.py   # Complaint operations
│   │   ├── conversation_service.py # Chat session management
│   │   ├── email_service.py       # SMTP email dispatch
│   │   ├── auth_service.py        # JWT auth logic
│   │   └── validation_service.py  # Input validation
│   ├── schemas/          # Pydantic request/response schemas
│   ├── utils/            # Helpers (security, file uploads, constants)
│   └── requirements.txt  # Python dependencies
│
└── frontend/             # React + TypeScript frontend
    ├── src/
    │   ├── App.tsx        # Root component with routing
    │   ├── pages/         # Page components
    │   │   ├── HomePage.tsx        # Landing page
    │   │   ├── ComplaintPage.tsx   # AI chat + complaint form
    │   │   ├── TrackPage.tsx      # Complaint tracking
    │   │   ├── AdminLoginPage.tsx  # Admin login
    │   │   └── AdminDashboard.tsx  # Admin management panel
    │   ├── services/
    │   │   └── api.ts     # API client (all backend calls)
    │   ├── components/    # Reusable UI components
    │   └── contexts/      # React contexts (language)
    ├── vite.config.ts     # Vite configuration
    └── package.json       # Node.js dependencies
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### 1. Clone & Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY, SMTP credentials, etc.
```

### 2. Configure Environment Variables

Edit `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./cyberguard.db
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin3967
JWT_SECRET=change_this_secret_in_production
```

> **Note:** For PostgreSQL, use: `DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/cyberguard_db`

### 3. Start Backend

```bash
cd backend
source .venv/bin/activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at **http://localhost:8000**. On first startup:
- Database tables are auto-created
- Default admin account is seeded

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:8080**.

---

## 📡 API Reference

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Send message to AI assistant, returns guided response |

### Complaints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/complaint/create` | Submit a new complaint |
| `POST` | `/complaint/upload` | Upload evidence file for a ticket |
| `GET`  | `/complaint/{ticket_id}` | Track complaint by ticket ID |

### Admin (JWT Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/login` | Admin login, returns JWT token |
| `GET`  | `/admin/complaints` | List all complaints |
| `PUT`  | `/admin/update-status` | Update complaint status |

### AI Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai/detect-language` | Detect language of input text |
| `POST` | `/ai/translate` | Translate text to target language |
| `POST` | `/ai/speech-to-text` | Convert audio/video to text |
| `POST` | `/ai/text-to-speech` | Get translated text for browser TTS |

> **Interactive API docs:** http://localhost:8000/docs (Swagger UI)

---

## 🌐 Supported Languages

English · Hindi · Bengali · Tamil · Telugu · Kannada · Malayalam · Marathi · Gujarati · Odia · Punjabi · Assamese · Urdu · Konkani · Manipuri · Nepali · Sanskrit · Sindhi · Dogri · Maithili · Bodo · Santali · Kashmiri

---

## 🔐 Admin Access

| Field | Default Value |
|-------|---------------|
| Email | `admin@gmail.com` |
| Password | `admin3967` |

Access the admin panel at: **http://localhost:8080/admin**

---

## 📋 Complaint Types

The system supports 33+ cyber crime categories including:

- UPI / Payment Fraud
- Credit/Debit Card Fraud
- Phishing / Vishing / Smishing
- Social Media Hacking & Identity Theft
- Sextortion / Blackmail
- Ransomware & Malware Attacks
- E-Commerce Fraud
- Job Fraud / Employment Scam
- Data Breach / Data Theft
- And many more...

---

## 🔧 Configuration

### Database Options

| Database | `DATABASE_URL` |
|----------|-----------------|
| **SQLite** (default) | `sqlite:///./cyberguard.db` |
| **PostgreSQL** | `postgresql+psycopg://user:pass@host:5432/dbname` |

### Email (Gmail SMTP)

To use Gmail SMTP, you need an **App Password**:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate an App Password under "App passwords"
4. Use that as `SMTP_PASSWORD`

---

## 📁 Ticket ID Format

Tickets are auto-generated as:

```
CGAI-YYYYMMDD-XXXX
```

Example: `CGAI-20260326-4821`

---

## 🛠️ Development

### Backend

```bash
# Run with auto-reload
uvicorn main:app --reload --port 8000

# Access Swagger docs
open http://localhost:8000/docs
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint
```

---

## 📄 License

This project is part of the **National Cyber Crime Complaint System** initiative.

---

<p align="center">
  <strong>🇮🇳 Built for India · Powered by AI · Available in 23 Languages</strong>
</p>
