from datetime import datetime
from random import randint


def generate_ticket_id() -> str:
    date_part = datetime.utcnow().strftime("%Y%m%d")
    random_part = f"{randint(0, 9999):04d}"
    return f"CGAI-{date_part}-{random_part}"
