from db import engine, Base
from models import Course
from sqlalchemy.orm import Session

COURSES = [
    {
        "title": "Python for Beginners", 
        "description": "Learn Python programming from scratch with hands-on projects and real-world examples.", 
        "level": "Beginner",
        "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop"
    },
    {
        "title": "Advanced Python", 
        "description": "Master advanced Python concepts including decorators, generators, and async programming.", 
        "level": "Advanced",
        "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop"
    },
    {
        "title": "Web Dev with FastAPI", 
        "description": "Build modern, fast APIs with FastAPI framework and learn best practices.", 
        "level": "Intermediate",
        "image_url": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
    },
    {
        "title": "Data Structures in C", 
        "description": "Master fundamental data structures and algorithms using the C programming language.", 
        "level": "Beginner",
        "image_url": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop"
    },
    {
        "title": "React Basics", 
        "description": "Build interactive user interfaces with React, hooks, and modern development tools.", 
        "level": "Beginner",
        "image_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop"
    },
    {
        "title": "Docker Essentials", 
        "description": "Learn containerization with Docker, from basics to production deployment strategies.", 
        "level": "Intermediate",
        "image_url": "https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=300&fit=crop"
    },
    {
        "title": "Intro to Databases", 
        "description": "Understand database design, SQL queries, and data modeling fundamentals.", 
        "level": "Beginner",
        "image_url": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop"
    },
    {
        "title": "Machine Learning 101", 
        "description": "Introduction to machine learning concepts, algorithms, and practical applications.", 
        "level": "Intermediate",
        "image_url": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop"
    },
    {
        "title": "JavaScript Fundamentals", 
        "description": "Master JavaScript from basics to advanced concepts including ES6+ features.", 
        "level": "Beginner",
        "image_url": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop"
    },
]

def seed():
    Base.metadata.create_all(bind=engine)
    db = Session(bind=engine)
    existing = db.query(Course).count()
    if existing == 0:
        for c in COURSES:
            course = Course(
                title=c["title"], 
                description=c["description"], 
                level=c["level"],
                image_url=c["image_url"]
            )
            db.add(course)
        db.commit()
    db.close()

if __name__ == "__main__":
    seed()
