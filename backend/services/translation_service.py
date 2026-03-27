from services.gemini_service import gemini_service


class TranslationService:
    def detect_language(self, text: str) -> str:
        return gemini_service.detect_language(text)

    def translate(self, text: str, target_language: str) -> str:
        return gemini_service.translate_text(text, target_language)

    def to_english(self, text: str) -> str:
        return gemini_service.to_english(text)


translation_service = TranslationService()
