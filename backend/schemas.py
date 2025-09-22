from pydantic import BaseModel, Field
from typing import Optional


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CourseOut(BaseModel):
    id: int
    title: str
    description: str
    level: str
    image_url: Optional[str] = None

    class Config:
        orm_mode = True   


class EnrollmentCreate(BaseModel):
    course_id: int


class EnrollmentOut(BaseModel):
    id: int
    course: CourseOut
    progress_pct: int

    class Config:
        orm_mode = True  


class ProgressUpdate(BaseModel):
    progress_pct: int = Field(..., ge=0, le=100)
