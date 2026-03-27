from routes.chat import router as chat_router
from routes.complaint import router as complaint_router
from routes.admin import router as admin_router
from routes.ai import router as ai_router

__all__ = ["chat_router", "complaint_router", "admin_router", "ai_router"]
