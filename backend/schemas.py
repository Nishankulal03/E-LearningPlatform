from pydantic import BaseModel, Field, ConfigDict
from typing import Annotated

class UserCreate(BaseModel):
    username: Annotated[str, Field(min_length=3, max_length=50)]
    password: Annotated[str, Field(min_length=6)]

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class CourseOut(BaseModel):
    id: int
    title: str
    description: str
    level: str
    image_url: str | None = None

    # ✅ Pydantic v2 way of replacing orm_mode
    model_config = ConfigDict(from_attributes=True)

class EnrollmentCreate(BaseModel):
    course_id: int

class EnrollmentOut(BaseModel):
    id: int
    course: CourseOut
    progress_pct: int

    model_config = ConfigDict(from_attributes=True)

class ProgressUpdate(BaseModel):
    progress_pct: int = Field(..., ge=0, le=100)
