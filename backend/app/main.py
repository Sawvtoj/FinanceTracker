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
def add_number(income_value: int, db: Session = Depends(get_db)):
    num = models.Income(income_value=income_value)
    db.add(num)
    db.commit()
    db.refresh(num)
    return num

@app.post("/addName")
def add_name(income_name: str, db: Session = Depends(get_db)):
    name = models.Income(income_name=income_name)
    db.add(name)
    db.commit()
    db.refresh(name)
    return name

@app.post("/addNameandNum")
def addNameandNum(income_name: str, income_value: int, db: Session = Depends(get_db)):
    nameandnum = models.Income(income_name=income_name, income_value=income_value)
    
    db.add(nameandnum)
    db.commit()
    db.refresh(nameandnum)

    return nameandnum

@app.get("/datanumbers")
def get_numbers(db: Session = Depends(get_db)):
    return db.query(models.Income).filter(models.Income.is_deleted == False).all()
    
    # return db.query(models.Number).all()

@app.post("/dellrow")
def del_lrow(db: Session = Depends(get_db)):
    obj = db.query(models.Income).order_by(models.Income.income_id.desc()).first()
    
    if obj is None:
        raise HTTPException(status_code=404, detail='No Numbers Found!!!')

    db.delete(obj)
    db.commit()

    return {"message": "Delete Successful", "Deleted": obj}

@app.post("/setdelete")
def del_row(db: Session = Depends(get_db)):
    
    obj = db.query(models.Income).order_by(models.Income.income_id.desc()).first()
    
    obj.is_deleted = True

    db.commit()

    return {"message": "Delete Successful", "Deleted": obj}

