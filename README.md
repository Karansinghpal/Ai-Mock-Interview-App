# AI Mock Interview Preparation App

A full-stack MERN application that helps users practice technical interviews for MERN, C++, and Java using AI-powered question generation and feedback.

## Features

- 🤖 **AI-Powered Questions**: Generate personalized interview questions using OpenRouter API
- 💡 **Instant Feedback**: Receive detailed feedback and scoring for each answer
- 📊 **Track Progress**: Monitor your interview performance over time
- 🎯 **Multiple Technologies**: Practice interviews for MERN, C++, and Java
- 🎤 **Voice Input**: Answer questions using your microphone with speech recognition
- 📱 **Modern UI**: Beautiful, responsive design with smooth animations

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- OpenRouter API

### Frontend
- React
- React Router
- Axios
- CSS3

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenRouter API Key

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Ai-InterviewApp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-app
OPENROUTER_API_KEY=your-openrouter-api-key-here
PORT=3001
JWT_SECRET=your-secure-jwt-secret-key
EMAIL_USER=your-email@gmail.com
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in the `.env` file.

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:3001`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Interviews

- `POST /api/interviews/start` - Start a new interview session
- `POST /api/interviews/:sessionId/answer` - Submit an answer for a question
- `GET /api/interviews/:sessionId` - Get interview session details
- `POST /api/interviews/:sessionId/complete` - Complete an interview session
- `GET /api/interviews/user/:userId` - Get user's interview history

## Project Structure

```
Ai-InterviewApp/
├── backend/
│   ├── models/
│   │   └── InterviewSession.js
│   ├── routes/
│   │   └── interviewRoutes.js
│   ├── services/
│   │   └── aiService.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js
│   │   │   ├── Interview.js
│   │   │   ├── Results.js
│   │   │   └── History.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Usage

1. **Start Interview**: Enter your name and select a technology (MERN, C++, or Java)
2. **Answer Questions**: Read each question and provide your answer
3. **Get Feedback**: Submit your answer to receive AI-powered feedback and scoring
4. **View Results**: After completing the interview, view detailed results and feedback
5. **Track Progress**: Check your interview history to see your progress over time

## Environment Variables

### Backend (.env)

- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string (MongoDB Atlas or local)
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `JWT_SECRET`: Secret key for JWT authentication (optional)
- `EMAIL_USER`: Email address for notifications (optional)

## Notes

- The app uses OpenRouter API with GPT-3.5-turbo model for question generation and answer evaluation
- Fallback questions are available if the AI API fails
- Interview sessions are stored in MongoDB
- User ID is stored in localStorage for session management
- Backend runs on port 3001 by default
- OpenRouter provides access to multiple AI models - you can change the model in `backend/services/aiService.js`

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!

