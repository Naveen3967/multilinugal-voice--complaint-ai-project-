"""
LLM service selector with Gemini primary and Ollama fallback.
Avoids eager provider initialization failures during app startup.
"""
import logging

logger = logging.getLogger(__name__)

# Track which LLM is active
ACTIVE_LLM = None


def get_llm_service():
    """
    Get appropriate LLM service with intelligent fallback.
    - Primary: Gemini (powerful, cloud-based)
    - Fallback: Ollama (local, always available)
    """
    global ACTIVE_LLM
    
    try:
        from config import settings

        # Check API key before importing Gemini service to avoid eager model probing.
        gemini_key = (settings.gemini_api_key or "").strip()
        if gemini_key and gemini_key != "dev_key_placeholder":
            from services.gemini_service import gemini_service

            ACTIVE_LLM = "gemini-2.5-flash"
            logger.info("Using Gemini as primary LLM")
            return gemini_service

        logger.warning("Gemini key not configured; falling back to Ollama")
    except Exception as e:
        logger.warning(f"Gemini initialization failed ({e}); falling back to Ollama")
    
    try:
        from services.ollama_service import ollama_service

        ACTIVE_LLM = "ollama-llama2"
        logger.info("Using Ollama as fallback LLM")
        return ollama_service
    except Exception as e:
        logger.error(f"Both Gemini and Ollama initialization failed: {e}")
        raise RuntimeError("No LLM service available! Configure Gemini API key or Ollama.")


def get_active_llm_name() -> str:
    """Get the name of the currently active LLM."""
    global ACTIVE_LLM
    if ACTIVE_LLM is None:
        # Initialize by calling get_llm_service
        get_llm_service()
    return ACTIVE_LLM or "unknown"


# Export selected LLM service
llm_service = get_llm_service()
