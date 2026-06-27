# Campus2Career — Internship Portal

🌐 **Live Demo:** [https://campus-2-career-internship-portal--sejalbajaj.replit.app](https://campus-2-career-internship-portal--sejalbajaj.replit.app)

---

## What is this?

CampusToCareer is a full-stack web application that connects **students looking for internships** with **companies looking for talent** — all in one place.

Before this, students had to search many different websites, and companies had no easy way to reach college students directly. This platform solves that by bringing both sides together.

---

## Features

### For Students
- Sign up and log in securely (with OTP verification on email)
- Build a complete profile — name, university, skills, GPA, LinkedIn, GitHub
- Upload profile photo and resume (PDF)
- Browse all available internships and view details
- Apply with a cover letter
- Track application status (Pending / Shortlisted / Rejected)
- **ATS Resume Analyzer** — paste a job description and get an AI-powered score, matched/missing keywords, section feedback, and improvement tips

### For Companies
- Post internship openings with title, location, duration, stipend, and requirements
- View all applicants with their full profile, skills, and cover letter
- Download or view applicant resumes
- **ATS Match Analyzer** — analyze any applicant's resume against the job description and get a fit score, recruiter snapshot, and skill match report
- Shortlist or reject applicants (email notification sent automatically)

### General
- Blog section with tech articles
- Latest news section
- Analytics dashboard (internship and application stats)
- Fully responsive UI

---

## Tech Stack

| Part | Technology |
|------|-----------|
| Backend | Node.js, Express.js |
| Frontend | EJS (templating), HTML, CSS, JavaScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT tokens + bcrypt password hashing |
| OTP / Email | Nodemailer |
| File Storage | Cloudinary (resume + profile photo) |
| PDF Parsing | pdf2json |
| AI Analysis | Groq API (LLaMA 3.3 70B) |
| Deployment | Replit |

---

## How to Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/sejalbajaj2004/Campus2Career_InternshipPortal.git
cd Campus2Career_InternshipPortal
```

**2. Install dependencies**
```bash
npm install
```

**3. Create a `.env` file** in the root folder with these values:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
PORT=3000
```

**4. Start the server**
```bash
node server.js
```

**5. Open in browser**
```
http://localhost:3000
```

---

## Project Structure

```
campus2career/
├── config/          # Database connection
├── middleware/      # Auth middleware
├── models/          # MongoDB models (User, Internship, Application, etc.)
├── routes/          # All route handlers
├── views/           # EJS templates
├── public/          # CSS, JS, images
├── services/        # Email service
└── server.js        # Entry point
```

---

## Made by

**Sejal Bajaj** — 3rd Year CSE Student, Chitkara University  
