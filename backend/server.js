const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const interviewRoutes = require('./routes/interviewRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/interviews', interviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// MongoDB connection
let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-app';

// If MongoDB Atlas URI doesn't have a database name, add it
if (mongoURI.includes('mongodb.net') && !mongoURI.match(/mongodb\.net\/[^?]/)) {
  // Insert database name before the query string or at the end
  if (mongoURI.includes('?')) {
    mongoURI = mongoURI.replace('mongodb.net/?', 'mongodb.net/interview-app?');
  } else {
    mongoURI = mongoURI.replace('mongodb.net', 'mongodb.net/interview-app');
  }
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

