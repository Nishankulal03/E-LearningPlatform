from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from auth import get_password_hash, create_access_token, verify_password, get_current_user, get_db
from models import User, Course, Enrollment, Base
from schemas import UserCreate, Token, CourseOut, EnrollmentCreate, EnrollmentOut, ProgressUpdate
from db import engine
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ensure DB tables + seed data on startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    if not db.query(Course).first():
        seed_courses = [
            Course(title="Intro to Python", level="Beginner", description="Learn Python basics."),
            Course(title="Advanced Python", level="Advanced", description="Deep dive into Python."),
            Course(title="Web Development with FastAPI", level="Intermediate", description="Build APIs with FastAPI."),
            Course(title="Databases with SQLAlchemy", level="Intermediate", description="Master SQLAlchemy ORM."),
            Course(title="Machine Learning 101", level="Beginner", description="Intro to ML concepts."),
            Course(title="Deep Learning with PyTorch", level="Advanced", description="Neural networks & PyTorch."),
            Course(title="Frontend with React", level="Beginner", description="Learn React fundamentals."),
            Course(title="DevOps Basics", level="Intermediate", description="CI/CD, Docker, and cloud basics."),
        ]
        db.add_all(seed_courses)
        db.commit()
    db.close()

@app.post("/auth/signup", status_code=201)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    user = User(username=payload.username, hashed_password=get_password_hash(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "username": user.username}

@app.post("/auth/login", response_model=Token)
def login(form_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/courses", response_model=list[CourseOut])
def list_courses(level: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Course)
    if level:
        q = q.filter(Course.level == level)
    return q.all()

@app.get("/courses/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.get(Course, course_id)   # ✅ fixed
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.post("/enrollments", response_model=EnrollmentOut)
def create_enrollment(en: EnrollmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id, Enrollment.course_id == en.course_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    course = db.get(Course, en.course_id)   # ✅ fixed
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    enrollment = Enrollment(user_id=current_user.id, course_id=course.id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment

@app.get("/me/enrollments", response_model=list[EnrollmentOut])
def my_enrollments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Enrollment).filter(Enrollment.user_id == current_user.id).all()

@app.patch("/enrollments/{enrollment_id}/progress", response_model=EnrollmentOut)
def update_progress(enrollment_id: int, payload: ProgressUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = db.get(Enrollment, enrollment_id)   # ✅ fixed
    if not enrollment or enrollment.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    enrollment.progress_pct = payload.progress_pct
    db.commit()
    db.refresh(enrollment)
    return enrollment

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
