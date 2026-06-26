from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# allow React to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "API Running"}


@app.post("/numbers")
def add_number(value: int, db: Session = Depends(get_db)):
    num = models.Number(value=value)
    db.add(num)
    db.commit()
    db.refresh(num)
    return num


@app.get("/numbers")
def get_numbers(db: Session = Depends(get_db)):
    return db.query(models.Number).all()