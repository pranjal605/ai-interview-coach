
# AI Interview Coach 🚀

An AI-powered mock interview platform that helps students and job seekers prepare for technical interviews through role-specific questions, real-time feedback, voice responses, and performance analytics.

## 🌟 Features

### 🎯 Role-Based Interview Simulation

Practice interviews for multiple roles:

* Software Engineer
* Frontend Developer
* Backend Developer
* Data Analyst
* Data Scientist
* Product Manager

### 🤖 AI-Generated Interview Questions

Questions are dynamically generated using Google's Gemini AI based on:

* Selected role
* Difficulty level (Easy / Medium / Hard)

### 📊 Instant AI Feedback

After each answer, the platform provides:

* Score (1–10)
* Strengths
* Areas for Improvement
* Keyword Coverage
* Model Answer

### 🎤 Voice Input Support

Answer interview questions using voice through the browser's Web Speech API.

### 📄 Job Description Interview Mode

Paste any job description and automatically generate targeted interview questions tailored to the role.

### 📈 Performance Analytics

Track interview performance with:

* Average Score
* Score Trend Charts
* Best Answer Analysis
* Weakest Topic Identification

### 💾 Session History

All interview sessions are stored in MongoDB and can be reviewed later.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Recharts
* Plain CSS
* Web Speech API

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

### AI

* Google Gemini API
* @google/generative-ai SDK

---

## 📂 Project Structure

```bash
interview-coach/
│
├── client/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── pages/
│   └── App.jsx
│
├── server/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-interview-coach.git

cd ai-interview-coach
```

---

## Backend Setup

Navigate to server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:3000
```

Run backend:

```bash
npm run dev
```

Server starts on:

```bash
http://localhost:5000
```

---

## Frontend Setup

Navigate to client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm start
```

Application starts on:

```bash
http://localhost:3000
```

---

## 🔑 Getting Gemini API Key

1. Visit:
   [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. Create API Key

3. Copy into:

```env
GEMINI_API_KEY=YOUR_KEY
```

---

## 🗄️ MongoDB Atlas Setup

1. Create a free cluster.
2. Create a database user.
3. Add your IP address.
4. Copy connection string.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewcoach
```

---

## 🎮 How It Works

### Step 1

Select:

* Job Role
* Difficulty Level
* Number of Questions

### Step 2

Start Interview Session

### Step 3

Answer Questions

* Text Input
* Voice Input

### Step 4

Receive AI Feedback

* Score
* Strengths
* Improvements
* Model Answer

### Step 5

View Session Summary

* Average Score
* Progress Chart
* Best Answer
* Weakest Topic

---

## 📸 Screens

### Home Screen

* Role Selection
* Difficulty Selection
* Question Count

### Interview Screen

* AI Question
* Hint System
* Voice Input
* Countdown Timer

### Feedback Screen

* Score Analysis
* Improvement Suggestions
* Model Answer

### Summary Dashboard

* Performance Charts
* Session Insights

---

## 🚀 Future Enhancements

* Resume-Based Interview Generation
* Company-Specific Interview Mode
* AI Follow-Up Questions
* ATS Resume Checker
* Coding Interview Simulator
* Communication & Confidence Analysis
* Placement Readiness Score

---

## 🎯 Use Cases

* Campus Placement Preparation
* Technical Interview Practice
* Resume Screening Preparation
* Job-Specific Mock Interviews
* Communication Skill Improvement

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Pranjal Sharma**

B.Tech CSE Student | Aspiring Software Engineer

Built to help students prepare smarter for placements using AI. 🚀

---

