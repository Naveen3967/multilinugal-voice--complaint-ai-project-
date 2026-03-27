# CyberGuard AI Backend (FastAPI)

Production-ready Python backend for **CyberGuard AI - Multilingual Cyber Crime Complaint System**.

## Tech Stack
- FastAPI (Python only)
- Gemini API for AI tasks (chat, translation, language detection, evidence text extraction)
- PostgreSQL or MySQL via SQLAlchemy
- SMTP (Gmail)

## Setup
1. Create/update `.env` (already scaffolded):
   - `GEMINI_API_KEY`
   - `DATABASE_URL`
   - `SMTP_EMAIL`
   - `SMTP_PASSWORD`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run API:
   ```bash
   uvicorn main:app --reload
   ```

## Required APIs
- `POST /chat`
- `POST /complaint/create`
- `POST /complaint/upload`
- `GET /complaint/{ticket_id}`
- `POST /admin/login`
- `GET /admin/complaints`
- `PUT /admin/update-status`

## Additional AI APIs
- `POST /ai/detect-language`
- `POST /ai/translate`
- `POST /ai/speech-to-text`
- `POST /ai/text-to-speech`

## Ticket Format
Generated as: `CGAI-YYYYMMDD-XXXX`

## Complaint Types Included
- Financial Fraud
- Social Media Crimes
- Online Scams
- Cyber Harassment
- Women/Children Crimes
- Data Privacy
- Hacking
- Malware
- Cyber Terrorism
- E-commerce Fraud
- IP Crimes
- Email Crimes
- Mobile Crimes
- Dark Web Crimes
- Other Crimes
- Session Hijacking

## Language Flow
If no language selected in `/chat`, backend returns:
`Please select your language`

Supported languages:
English, Hindi, Konkani, Kannada, Dogri, Bodo, Urdu, Tamil, Kashmiri, Assamese, Bengali, Marathi, Sindhi, Maithili, Punjabi, Malayalam, Manipuri, Telugu, Sanskrit, Nepali, Santali, Gujarati, Odia.

After language is provided, responses are generated in that same language.

## Admin Seed
On startup, default admin is auto-created using:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Notes
- Keep `JWT_SECRET` strong in production.
- Use HTTPS + reverse proxy in deployment.
- Use managed DB backups for production reliability.
