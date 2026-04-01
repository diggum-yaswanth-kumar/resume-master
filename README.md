# Resume Master 👩‍🏫✨

Resume Master is a production-ready full-stack AI platform that analyzes resumes against job descriptions to provide detailed compatibility reporting, skill gap analysis, and ATS scores.

## Features
- **Authentication & Dashboard**: Secure user registration, JWT login, and a history dashboard of all previous analyses.
- **AI Matching**: Extracted text from uploaded PDF resumes is compared semantically against job descriptions.
- **Visual Insights**: Generates beautiful matching graphs using Recharts.
- **Actionable Advice**: Highlights missing skills, summarizes strengths/weaknesses, and provides step-by-step suggestions.
- **PDF Export**: Seamlessly download the analyzed compatibility report.
- **Modern UI**: Polished, responsive SaaS interface built with React and Tailwind CSS.

## Tech Stack
**Frontend**
- React 18 (Vite)
- Tailwind CSS (Styling)
- React Router (Routing)
- Axios (API Client)
- Recharts (Data Visualization)
- Lucide React (Icons)
- React Dropzone (File Upload)

**Backend**
- Python (FastAPI)
- MongoDB & Motor (Asynchronous Database)
- PyPDF2 (PDF Parsing logic)
- Regex Engine (NLP Replacement due to AppLocker configs)
- Passlib + Jose (JWT & Bcrypt Hashing)

## Setup Instructions

### 1. Database Setup
Install [MongoDB](https://www.mongodb.com/) locally and ensure it's running on the default port: `mongodb://localhost:27017` or overwrite the `.env` value in `backend/.env` with your MongoDB Atlas URI.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend API will run on http://localhost:8000*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend Vite app will run on http://localhost:5173 (or 5174)*

## Environment Variables
Create a `.env` in the `backend/` directory:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=resume_teacher
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## Deployment
- **Frontend**: Deploy perfectly on [Vercel](https://vercel.com/) by pointing the root directory to `frontend` and using `npm run build`.
- **Backend / Database**: Can be easily containerized and shipped to [Render](https://render.com/) or [Railway](https://railway.app/). Ensure MongoDB Atlas is used for remote deployments.

*Note: Screenshots can be taken directly inside the React App UI once deployed!*
