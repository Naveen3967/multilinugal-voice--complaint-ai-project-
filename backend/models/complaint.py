from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    ticket_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    complaint_type: Mapped[str] = mapped_column(String(100), index=True)
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True)
    language: Mapped[str] = mapped_column(String(40), default="English")

    date_time: Mapped[str] = mapped_column(String(100))
    amount_lost: Mapped[str | None] = mapped_column(String(100), nullable=True)
    transaction_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    platform: Mapped[str | None] = mapped_column(String(100), nullable=True)
    suspect_details: Mapped[str | None] = mapped_column(Text, nullable=True)
    suspect_vpa: Mapped[str | None] = mapped_column(String(100), nullable=True)
    suspect_phone: Mapped[str | None] = mapped_column(String(100), nullable=True)
    suspect_bank_account: Mapped[str | None] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="complaints")
    evidence_items = relationship("Evidence", back_populates="complaint", cascade="all, delete-orphan")
