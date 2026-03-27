import json
from pathlib import Path

import google.generativeai as genai

from config import settings
from utils.constants import COMPLAINT_TYPES, REQUIRED_COMPLAINT_FIELDS, SUPPORTED_LANGUAGES


class GeminiService:
    def __init__(self) -> None:
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(self._pick_model_name())

    def _pick_model_name(self) -> str:
        preferred = [
            "gemini-2.0-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
        ]
        try:
            available = [m.name.split("models/")[-1] for m in genai.list_models() if "generateContent" in m.supported_generation_methods]
            for candidate in preferred:
                if candidate in available:
                    return candidate
            if available:
                return available[0]
        except Exception as e:
            print(f"Error picking model: {e}")
            pass
        return "gemini-1.5-flash-latest"

    def _generate_with_retry(self, prompt: str | list, retries: int = 3) -> str:
        import time
        for i in range(retries):
            try:
                response = self.model.generate_content(prompt)
                return response.text or ""
            except Exception as e:
                err_str = str(e).lower()
                if ("429" in err_str or "rate_limit" in err_str or "quota" in err_str) and i < retries - 1:
                    time.sleep(2 ** i) # Exponential backoff
                    continue
                print(f"Gemini API Error: {e}")
                return ""
        return ""

    def _safe_json_parse(self, text: str) -> dict:
        text = text.strip()
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {}

    def detect_language(self, text: str) -> str:
        prompt = (
            "Detect the language of the user text from this list only: "
            f"{', '.join(SUPPORTED_LANGUAGES)}. "
            "Return only one language name, no extra words.\n\n"
            f"Text: {text}"
        )
        response_text = self._generate_with_retry(prompt)
        guess = (response_text or "English").strip()
        return guess if guess in SUPPORTED_LANGUAGES else "English"

    def translate_text(self, text: str, target_language: str) -> str:
        if not text.strip():
            return text
        prompt = (
            f"Translate the following text to {target_language}. "
            "Keep meaning exact, simple, and natural for Indian users.\n\n"
            f"Text: {text}"
        )
        response_text = self._generate_with_retry(prompt)
        return (response_text or "").strip()

    def to_english(self, text: str) -> str:
        return self.translate_text(text, "English")

    def generate_complaint_chat_reply(
        self,
        user_language: str,
        user_message: str,
        conversation_messages: list[dict],
        collected_fields: dict,
    ) -> dict:
        prompt = f"""
You are a multilingual cyber crime assistant.

Rules:
- Always respond in the user's selected language: {user_language}
- Guide step-by-step and naturally
- If user says they don't know, explain where to find info, example values, and why it is needed
- Validate inputs if possible
- Ask only one next important question
- Keep response short and clear

Required complaint fields:
{REQUIRED_COMPLAINT_FIELDS}
Optional fields:
amount_lost, transaction_id, suspect_details, suspect_vpa, suspect_phone, suspect_bank_account

Allowed complaint types:
{COMPLAINT_TYPES}

Conversation history:
{json.dumps(conversation_messages[-12:], ensure_ascii=False)}

Current collected fields:
{json.dumps(collected_fields, ensure_ascii=False)}

Current user message:
{user_message}

Return STRICT JSON with this shape:
{{
  "assistant_response": "string in user language",
  "intent": "file_complaint|track_complaint|general",
  "field_updates": {{"field_name": "value"}},
  "next_required_field": "field_name_or_null",
  "missing_fields": ["field1", "field2"]
}}
"""
        response_text = self._generate_with_retry(prompt)
        payload = self._safe_json_parse(response_text or "")
        if not payload:
            return {
                "assistant_response": self.translate_text("What can I help you with?", user_language),
                "intent": "general",
                "field_updates": {},
                "next_required_field": None,
                "missing_fields": REQUIRED_COMPLAINT_FIELDS,
            }
        return payload

    def analyze_evidence(self, file_path: str, mime_type: str) -> str:
        prompt = (
            "Extract all meaningful text and cyber-crime-relevant details from this file. "
            "Return plain text summary with names, accounts, UTR, links, timestamps, and suspicious indicators if present."
        )

        path = Path(file_path)
        if not path.exists():
            return ""

        uploaded = genai.upload_file(path=str(path), mime_type=mime_type)
        response = self.model.generate_content([prompt, uploaded])
        return (response.text or "").strip()


gemini_service = GeminiService()
