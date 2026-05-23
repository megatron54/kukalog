from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = "sqlite:///./kukalog.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    # General
    operator = Column(String)
    engineer = Column(String)
    shift = Column(String)
    # Machine
    robot_type = Column(String)
    controller = Column(String)
    cell = Column(String)
    line = Column(String)
    # Incident
    error_code = Column(String, index=True)
    category = Column(String, index=True)
    priority = Column(String)
    status = Column(String, index=True)
    title = Column(String)
    description = Column(Text)
    symptoms = Column(Text)
    # Solution
    solution = Column(Text)
    steps = Column(Text)
    downtime_min = Column(Integer)
    result = Column(String)
    # Extra
    notes = Column(Text)
    images = Column(Text)  # JSON array


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
