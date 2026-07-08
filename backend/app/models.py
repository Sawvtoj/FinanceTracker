from sqlalchemy import Column, Integer, Boolean, String
from .database import Base

class Income(Base):
    __tablename__ = "Income"

    income_id = Column(Integer, primary_key=True, index=True)
    income_name = Column(String)
    income_value = Column(Integer)
    is_deleted = Column(Boolean, default=False)