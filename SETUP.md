# Setup Guide

## Quick Start

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-app
OPENROUTER_API_KEY=your-openrouter-api-key-here
PORT=3001
JWT_SECRET=your-secure-jwt-secret-key
EMAIL_USER=your-email@gmail.com
```

**Getting OpenRouter API Key:**
1. Go to https://openrouter.ai/
2. Sign up or log in
3. Navigate to Keys section
4. Create a new API key
5. Copy the key to your `.env` file

**Note:** OpenRouter provides access to multiple AI models. The app uses `openai/gpt-3.5-turbo` by default.

**MongoDB Setup Options:**
- **Local MongoDB**: Install MongoDB locally and use `mongodb://localhost:27017/interview-app`
- **MongoDB Atlas**: Create a free cluster at https://www.mongodb.com/cloud/atlas and use the connection string

### 3. Start MongoDB

**If using local MongoDB:**
- Windows: Make sure MongoDB service is running
- Mac/Linux: Run `mongod` in terminal

**If using MongoDB Atlas:**
- No local setup needed, just use the connection string from Atlas

### 4. Run the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm start
```

### 5. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local MongoDB)
- Check the MongoDB URI in `.env` file
- Verify network connectivity (if using MongoDB Atlas)

### OpenRouter API Issues
- Verify your API key is correct
- Check your OpenRouter account has credits
- The app will use fallback questions if the API fails
- Check the OpenRouter dashboard for API usage and limits

### Port Already in Use
- Change the PORT in `.env` file (backend, default is 3001)
- Update the proxy in `frontend/package.json` if you change the backend port

## Project Structure

```
Ai-InterviewApp/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI service)
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── package.json
└── README.md
```

## Features Overview

1. **Home Page**: Select technology and start interview
2. **Interview Page**: Answer questions and get instant feedback
3. **Results Page**: View detailed results and scores
4. **History Page**: Track your interview history

## Next Steps

1. Customize questions by editing `backend/services/aiService.js`
2. Add more technologies by updating the technology list
3. Enhance UI by modifying CSS files
4. Add authentication for user management
5. Add more AI models or features

