from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Unique frontend session identifier")
    language: str | None = Field(default=None, description="User selected language")
    message: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    session_id: str
    detected_language: str
    response: str
    intent: str | None = None
    next_field: str | None = None
    collected_fields: dict = Field(default_factory=dict)
    missing_fields: list[str] = Field(default_factory=list)
