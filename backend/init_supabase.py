import os
from dotenv import load_dotenv

# Load the env vars before anything else
load_dotenv()

from database import engine, Base
from models.user import User
from models.admin import Admin
from models.conversation import ConversationSession
from models.complaint import Complaint, Evidence
from auth import get_password_hash
from sqlalchemy.orm import Session

print("Creating database tables in Supabase...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")

print("Seeding database...")
with Session(engine) as db:
    admin_email = "admin@gmail.com"
    existing_admin = db.query(Admin).filter(Admin.email == admin_email).first()
    if not existing_admin:
        admin = Admin(
            email=admin_email,
            hashed_password=get_password_hash("admin3967"),
            is_active=True,
            is_superadmin=True
        )
        db.add(admin)
        db.commit()
        print(f"Admin user {admin_email} seeded successfully.")
    else:
        print(f"Admin user {admin_email} already exists.")
print("Database setup complete.")
