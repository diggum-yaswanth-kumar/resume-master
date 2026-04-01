import reportlab
from reportlab.pdfgen import canvas

c = canvas.Canvas("dummy_resume.pdf")
c.drawString(100, 750, "Jane Doe")
c.drawString(100, 735, "Email: jane@example.com")
c.drawString(100, 700, "Skills:")
c.drawString(100, 680, "Python, React, JavaScript, MongoDB, API, Docker, FastAPI, Git, SQL")
c.drawString(100, 650, "Experience:")
c.drawString(100, 630, "Software Engineer at TechCorp")
c.drawString(100, 615, "- Developed REST APIs using FastAPI and Python.")
c.drawString(100, 600, "- Built interactive user interfaces using React and Tailwind CSS.")
c.save()
print("Created dummy_resume.pdf")
