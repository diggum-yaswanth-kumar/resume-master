import pytest
from fastapi.testclient import TestClient
from main import app
import io
import time

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Resume Master API!"}

def get_auth_token():
    # Attempt register
    email = f"testuser_{int(time.time())}@example.com"
    client.post("/auth/register", json={
        "name": "Integration Tester",
        "email": email,
        "password": "strongPassword123!"
    })
    
    login_response = client.post("/auth/login", json={
        "email": email,
        "password": "strongPassword123!"
    })
    assert login_response.status_code == 200
    return login_response.json().get("access_token")

def test_auth_flow():
    token = get_auth_token()
    assert token is not None

def test_analyze_resume():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 61 >>\nstream\nBT /F1 12 Tf 100 700 Td (Python React FastAPI MongoDB API SQL) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000244 00000 n \n0000000355 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n443\n%%EOF"
    
    files = {"file": ("test.pdf", io.BytesIO(pdf_content), "application/pdf")}
    data = {"job_description": "We need someone with Python and React skills to build a FastAPI backend."}
    
    res = client.post("/api/analyze", headers=headers, files=files, data=data)
    assert res.status_code == 200
    json_res = res.json()
    
    assert "analysis" in json_res
    analysis = json_res["analysis"]
    assert "match_score" in analysis
    assert analysis["match_score"] > 0
    assert "python" in analysis["extracted_skills"]

def test_history():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Check history endpoint properly mounts
    res = client.get("/api/history", headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)
