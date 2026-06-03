from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.employee_model import Employee
from app.routes.employee_route import router as employee_router
from app.database.database import engine, Base
from app.models.user_model import User
from app.routes.user_route import router as user_router
from sqlalchemy import text


Base.metadata.create_all(bind=engine)

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active'"))
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_su BOOLEAN DEFAULT FALSE"))
    conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS is_superuser"))
    conn.commit()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(employee_router)

@app.get("/")
def home():

    return {
        "message": "Backend Running Successfully"
    }