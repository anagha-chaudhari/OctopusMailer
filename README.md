# OctopusMailer 🐙
 
### Bulk email campaigns with passive open & click tracking - no third-party service required.
> AI-assisted template generation | Emails and Campaigns with an interactive drag-and-drop editor | pixel-based tracking | per-campaign analytics
 
<!-- BADGES -->
<div align="center">
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=flat-square&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![OpenAI](https://img.shields.io/badge/AI-GPT--4o--mini-412991?style=flat-square&logo=openai&logoColor=white)
![SMTP](https://img.shields.io/badge/Delivery-SMTP%20%2F%20STARTTLS-EA4335?style=flat-square&logoColor=white)
 
</div>


## Features

- Send bulk HTML email campaigns via SMTP
- AI email template generation using OpenAI (`gpt-4o-mini`)
- Email customization using drag-and-drop email builder
- Open & click tracking with pixel + redirect analytics
- CSV recipient upload and parsing
- SQLAlchemy

---

## Architecture

<p align="center">
  <img src="images/arch.png" width="600"/>
</p>

1. Client Layer
The frontend acts as the interaction layer where users:

► create campaigns using a drag-and-drop editor
► upload recipient CSV files
► view campaign analytics and engagement metrics

The client communicates with the backend only through REST API endpoints.

<p align="center">
  <img src="images/page1.png" width="600"/>
</p>
<p align="center">
  <img src="images/page2.png" width="600"/>
</p>

2.  Backend API Layer

The Flask backend is split into modular APIs:

► Campaign API → handles campaign creation and recipient uploads
► Analytics API → tracks opens/clicks and returns engagement metrics
► OpenAI API → generates AI-assisted email content

<p align="center">
  <img src="images/analytics.png" width="600"/>
</p>

<p align="center">
  <img src="images/aitemp.png" width="600"/>
</p>

3. Service Layer

Business logic is isolated inside dedicated services:

► Email Service manages bulk email delivery and tracking integration
► Analytics Service computes open rates, click metrics, and dashboard statistics

4. Database Design

The system uses a relational SQLite schema with a clear 1:N relationship:

► One Campaign
► Many Recipients

Each recipient stores tracking metadata such as:

► opened status
► clicked status
► timestamps for engagement events

This structure supports analytics computation while maintaining normalized relational modeling.

5. External Integrations

The architecture integrates with:

SMTP for email delivery
OpenAI API for AI-generated campaign content

External services remain isolated from core business logic through dedicated API/service boundaries.

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
