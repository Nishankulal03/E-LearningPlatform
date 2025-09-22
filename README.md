# 📚 E-Learning Platform

A full-stack **E-Learning Platform** with:  
- **Backend**: FastAPI + SQLite (local) / PostgreSQL (Render)  
- **Frontend**: React + Vite (Vercel)  

---

## 🚀 Features
- 🔑 User Authentication (JWT)
- 📚 Course Catalog (Beginner, Intermediate, Advanced)
- 📝 Enrollments with progress tracking
- 🌐 Fully deployed on **Render** + **Vercel**

---

## 🛠️ Tech Stack
### Backend
- FastAPI
- SQLAlchemy
- SQLite (local dev) / PostgreSQL (Render)
- JWT (python-jose)
- Uvicorn
- Render (deployment)

### Frontend
- React + Vite
- Axios (API calls)
- Vercel (deployment)

---

## 📂 Project Structure
```

E-LearningPlatform/
│── backend/        # FastAPI backend
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── db.py
│   ├── seed.py
│   ├── requirements.txt
│   └── .env
│
│── frontend/       # React frontend (Vite)
│   ├── src/
│   │   ├── css/
│   │   ├── components/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.js
│  

````

---

## 📦 Backend Setup (FastAPI)

### 1. Clone repo
```bash
git clone https://github.com/Nishankulal03/E-LearningPlatform.git
cd E-LearningPlatform/backend
````

### 2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure `.env`

#### 👉 Local (SQLite)

```
DATABASE_URL=sqlite:///./mini_courses.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### 👉 Deployment (PostgreSQL on Render)

```
DATABASE_URL=postgresql+psycopg2://<username>:<password>@<host>:<port>/<dbname>
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Run locally

```bash
uvicorn main:app --reload
```

📍 Open: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🌐 Backend Deployment (Render)

1. Push backend code to GitHub.
2. Create **Web Service** on [Render](https://dashboard.render.com/).
3. Add a **PostgreSQL DB** on Render (or use SQLite for dev only).
4. Set **Environment Variables** from `.env`.
5. Build Command:

   ```bash
   pip install -r requirements.txt
   ```
6. Start Command:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
7. Deploy 🚀

---

## 💻 Frontend Setup (React + Vite)

### 1. Go to frontend

```bash
cd ../frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

📍 Open: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Frontend Deployment (Vercel)

1. Push frontend code to GitHub.
2. Create project in [Vercel](https://vercel.com/).
3. Connect repo and select `frontend/` as root directory.
4. Deploy 🚀

---

## 🧪 API Endpoints

### Auth

* `POST /auth/signup` → Register
* `POST /auth/login` → Login (JWT)

### Courses

* `GET /courses` → List courses
* `GET /courses/{id}` → Get course by ID

### Enrollments

* `POST /enrollments` → Enroll in a course
* `GET /me/enrollments` → Get my enrollments
* `PATCH /enrollments/{id}/progress` → Update progress

---
## 👤 Author

**Nishan Kulal**


