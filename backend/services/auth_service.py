from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database import get_db
from models.admin import Admin
from utils.security import create_access_token, decode_access_token, verify_password


security = HTTPBearer()


class AuthService:
    def login_admin(self, db: Session, email: str, password: str) -> str | None:
        admin = db.query(Admin).filter(Admin.email == email).first()
        if not admin:
            return None

        if not verify_password(password, admin.password):
            return None

        return create_access_token(subject=admin.email)


auth_service = AuthService()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> Admin:
    token = credentials.credentials
    email = decode_access_token(token)

    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    admin = db.query(Admin).filter(Admin.email == email).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found")

    return admin
