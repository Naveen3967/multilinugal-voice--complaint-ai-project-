from sqlalchemy.orm import Session

from models.conversation import ConversationSession


class ConversationService:
    def get_or_create(self, db: Session, session_id: str) -> ConversationSession:
        session = db.query(ConversationSession).filter(ConversationSession.session_id == session_id).first()
        if session:
            return session

        session = ConversationSession(
            session_id=session_id,
            selected_language="English",
            messages=[],
            collected_fields={},
            last_intent=None,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    def add_message(self, db: Session, session: ConversationSession, role: str, content: str) -> None:
        messages = list(session.messages or [])
        messages.append({"role": role, "content": content})
        session.messages = messages
        db.add(session)
        db.commit()

    def update_after_chat(
        self,
        db: Session,
        session: ConversationSession,
        language: str,
        intent: str | None,
        field_updates: dict,
    ) -> None:
        session.selected_language = language
        merged = dict(session.collected_fields or {})
        merged.update(field_updates or {})
        session.collected_fields = merged
        session.last_intent = intent
        db.add(session)
        db.commit()


conversation_service = ConversationService()
