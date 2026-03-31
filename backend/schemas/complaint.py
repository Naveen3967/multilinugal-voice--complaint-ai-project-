from datetime import datetime

from pydantic import BaseModel, Field


class ComplaintCreateRequest(BaseModel):
    """Standard complaint creation with full details."""

    full_name: str
    phone_number: str
    email: str | None = None
    address: str | None = None
    complaint_type: str
    date_time: str | None = None
    description: str
    amount_lost: str | None = None
    transaction_id: str | None = None
    platform: str | None = None
    suspect_details: str | None = None
    suspect_vpa: str | None = None
    suspect_phone: str | None = None
    suspect_bank_account: str | None = None
    language: str = "English"


class ComplaintCreateWithPartialIDRequest(BaseModel):
    """Complaint creation allowing partial/unclear ID proof data with manual override."""

    complaint_type: str
    description: str
    language: str = "English"

    full_name: str | None = None
    phone_number: str | None = None
    email: str | None = None
    address: str | None = None

    extracted_name: str | None = None
    extracted_phone: str | None = None
    extracted_email: str | None = None
    extracted_address: str | None = None
    extracted_id_number: str | None = None
    extracted_document_type: str | None = None

    date_time: str | None = None
    amount_lost: str | None = None
    transaction_id: str | None = None
    platform: str | None = None
    suspect_details: str | None = None
    suspect_vpa: str | None = None
    suspect_phone: str | None = None
    suspect_bank_account: str | None = None

    id_proof_id_number: str | None = None
    id_proof_document_type: str | None = None


class ComplaintCreateResponse(BaseModel):
    ticket_id: str
    status: str
    created_at: datetime
    message: str


class ComplaintTrackResponse(BaseModel):
    ticket_id: str
    status: str
    complaint_type: str
    description: str
    language: str
    created_at: datetime


class ComplaintStatusUpdateRequest(BaseModel):
    ticket_id: str = Field(..., min_length=4)
    status: str = Field(..., pattern="^(pending|reviewing|resolved)$")
