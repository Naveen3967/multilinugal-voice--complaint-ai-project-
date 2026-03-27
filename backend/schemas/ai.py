from pydantic import BaseModel


class DetectLanguageRequest(BaseModel):
    text: str


class DetectLanguageResponse(BaseModel):
    language: str


class TranslateRequest(BaseModel):
    text: str
    target_language: str


class TranslateResponse(BaseModel):
    translated_text: str


class TextToSpeechRequest(BaseModel):
    text: str
    language: str


class TextToSpeechResponse(BaseModel):
    # Frontend can synthesize this text with browser TTS in selected language voice.
    text_for_speech: str
    language: str
