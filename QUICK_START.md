# Quick Start Guide

## Setup Instructions

### 1. Create Backend .env File

Create a file named `.env` in the `backend` directory with the following content:

```env
MONGODB_URI=mongodb+srv://karan123:karan123@cluster0.aiblxyg.mongodb.net/?appName=Cluster0
EMAIL_USER=your-email@gmail.com

# JWT Secret for authentication
JWT_SECRET=your-secure-jwt-secret-key

# API Keys
OPENROUTER_API_KEY=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
VITE_OPENROUTER_API_KEY=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

# Other environment variables
PORT=3001
```

**Note:** The MongoDB URI will automatically have the database name `interview-app` added to it.

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## What Was Changed

1. **OpenRouter API Integration**: Replaced OpenAI API with OpenRouter API
2. **Port Configuration**: Changed default port from 5000 to 3001
3. **MongoDB Connection**: Added automatic database name handling for MongoDB Atlas URIs
4. **Environment Variables**: Updated to use OpenRouter API key and your MongoDB connection string
5. **Package Dependencies**: Removed OpenAI package, using Axios for API calls

## API Configuration

The app uses OpenRouter API with the `openai/gpt-3.5-turbo` model. You can change the model in `backend/services/aiService.js` if needed.

## Troubleshooting

- **MongoDB Connection**: Ensure your MongoDB Atlas cluster allows connections from your IP address
- **OpenRouter API**: Verify your API key has credits and is active
- **Port Conflicts**: Change PORT in .env if port 3001 is already in use

