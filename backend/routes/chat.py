from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from schemas.chat import ChatRequest, ChatResponse
from services.conversation_service import conversation_service
from services.gemini_service import gemini_service
from services.translation_service import translation_service
from utils.constants import REQUIRED_COMPLAINT_FIELDS, SUPPORTED_LANGUAGES, UNKNOWN_INPUT_HINTS


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
def chat_with_assistant(payload: ChatRequest, db: Session = Depends(get_db)):
    session = conversation_service.get_or_create(db, payload.session_id)

    if not payload.language and not session.messages:
        supported = ", ".join(SUPPORTED_LANGUAGES)
        return ChatResponse(
            session_id=payload.session_id,
            detected_language="English",
            response=f"Please select your language. Supported languages: {supported}",
            intent="general",
            next_field=None,
            collected_fields={},
            missing_fields=REQUIRED_COMPLAINT_FIELDS,
        )

    language = payload.language or session.selected_language
    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported language")

    conversation_service.add_message(db, session, role="user", content=payload.message)

    llm_payload = gemini_service.generate_complaint_chat_reply(
        user_language=language,
        user_message=payload.message,
        conversation_messages=session.messages,
        collected_fields=session.collected_fields or {},
    )

    field_updates = llm_payload.get("field_updates", {})
    intent = llm_payload.get("intent")
    next_field = llm_payload.get("next_required_field")
    missing_fields = llm_payload.get("missing_fields", REQUIRED_COMPLAINT_FIELDS)

    assistant_text = llm_payload.get("assistant_response") or translation_service.translate(
        "What can I help you with?",
        language,
    )

    user_message_norm = payload.message.strip().lower()
    if user_message_norm in {"i don't know", "i dont know", "dont know", "not sure", "don't know"}:
        hint = UNKNOWN_INPUT_HINTS.get(next_field or "")
        if hint:
            translated_hint = translation_service.translate(hint, language)
            assistant_text = f"{assistant_text}\n\n{translated_hint}"

    conversation_service.add_message(db, session, role="assistant", content=assistant_text)
    conversation_service.update_after_chat(db, session, language, intent, field_updates)

    return ChatResponse(
        session_id=payload.session_id,
        detected_language=language,
        response=assistant_text,
        intent=intent,
        next_field=next_field,
        collected_fields=session.collected_fields,
        missing_fields=missing_fields,
    )
