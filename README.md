
# OctopusMailer

A Flask-based email campaign management platform with AI-powered template generation, recipient tracking and analytics.

---

## Features

- 📧 Send bulk HTML email campaigns via SMTP
- 🤖 AI email template generation using OpenAI (`gpt-4o-mini`)
- 📝 Email customization using drag-and-drop email builder
- 📊 Open & click tracking with pixel + redirect analytics
- 📁 CSV recipient upload and parsing
- 🗄️ SQLAlchemy

---

## Architecture
<img width="502" height="667" alt="image" src="https://github.com/user-attachments/assets/150460cf-5822-438a-97af-89b293d2b841" />

---

## Setup

### 1. Clone & install dependencies

```bash
git clone https://github.com/yourname/octopusmailer.git
cd octopusmailer
pip install -r requirements.txt
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=sk-...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=yourpassword
DATABASE_URL=sqlite:///
```

### 3. Run

```bash
python app.py
```

App runs at `http://localhost:5000`

---

## Tech Stack

Python | Flask | SQLAlchemy | SMTP | OpenAI API | HTML | CSS | JavaScript

---

## Prototype Demonstration
https://youtu.be/gGtziIVxYOI?si=fw4IBgyJXKpzLQmq
