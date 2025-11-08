const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const InterviewSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  technology: {
    type: String,
    required: true,
    enum: ['MERN', 'C++', 'Java']
  },
  questions: [{
    type: String,
    required: true
  }],
  answers: [AnswerSchema],
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  totalScore: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);

