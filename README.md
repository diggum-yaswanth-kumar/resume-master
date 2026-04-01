# Resume Master 🎓✨

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-success?style=for-the-badge&logo=vercel)](https://resume-master-blond.vercel.app/)
[![Powered by](https://img.shields.io/badge/Powered_by-Google_Antigravity-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/)

Resume Master is a production-ready, full-stack AI platform designed to analyze resumes against job descriptions. It provides detailed compatibility reporting, skill gap analysis, and ATS scores to help candidates optimize their applications.

> **Note:** This entire application—including the frontend React UI, the backend Python API, the database architecture, the NLP heuristic logic, and the automated cloud deployments—was **100% generated and engineered by Google Antigravity**, an advanced agentic coding assistant by Google DeepMind.

---

## 🌟 Live Application
**Experience the live project here:** [https://resume-master-blond.vercel.app/](https://resume-master-blond.vercel.app/)

*(The frontend is hosted on Vercel, securely communicating with a Render-hosted FastAPI backend and MongoDB Atlas database).*

---

## ✨ Features
- **AI Matching**: Extracted text from uploaded PDF resumes is compared semantically against job descriptions.
- **Actionable Advice**: Intelligently highlights missing skills, summarizes strengths/weaknesses, and provides step-by-step UI suggestion cards.
- **Visual Insights**: Generates beautiful ATS matching graphs using Recharts with perfectly aligned donut charts.
- **Authentication & Dashboard**: Secure user registration, JWT login, and an interactive history dashboard of all previous analyses.
- **PDF Export**: Seamlessly download the analyzed compatibility report.
- **Modern UI**: Polished, responsive SaaS interface built with React and Tailwind CSS v4.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Data Fetching**: Axios
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Hosting**: Vercel

### Backend Architecture
- **API Framework**: Python (FastAPI)
- **Database**: MongoDB & Motor (Asynchronous Database Mapping)
- **PDF Processing**: PyPDF2
- **NLP Engine**: Custom heuristic matching engine created by Google Antigravity
- **Security**: Passlib + Jose (JWT Bearer Auth & Bcrypt Password Hashing)
- **Hosting**: Render (Infrastructure-as-Code via `render.yaml`)

---

## 🚀 Local Development Setup

### 1. Database Setup
Install [MongoDB](https://www.mongodb.com/) locally and ensure it's running on the default port: `mongodb://localhost:27017` or overwrite the `.env` value in `backend/.env` with an active MongoDB Atlas URI.

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API
uvicorn main:app --reload
```
*The backend API will run natively on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the development server
npm run dev
```
*The Vite application will mount dynamically on `http://localhost:5173`*

---

## 🔒 Environment Variables
To run the backend locally, create a `.env` file in the `backend/` directory with the following keys:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=resume_master
SECRET_KEY=your-highly-secure-secret-key-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

<p align="center">
  <i>Built with ❤️ by Google Antigravity</i>
</p>
