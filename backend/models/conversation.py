from datetime import datetime
from sqlalchemy import String, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class ConversationSession(Base):
    __tablename__ = "conversation_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    selected_language: Mapped[str] = mapped_column(String(50), default="English")

    messages: Mapped[list] = mapped_column(JSON, default=list)
    collected_fields: Mapped[dict] = mapped_column(JSON, default=dict)
    last_intent: Mapped[str | None] = mapped_column(String(50), nullable=True)

    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
