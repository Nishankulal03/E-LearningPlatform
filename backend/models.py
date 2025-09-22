from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    enrollments = relationship("Enrollment", back_populates="user")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    level = Column(String, nullable=False)
    image_url = Column(String, nullable=True)

    enrollments = relationship("Enrollment", back_populates="course")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    progress_pct = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
