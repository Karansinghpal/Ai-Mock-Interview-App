const express = require('express');
const router = express.Router();
const InterviewSession = require('../models/InterviewSession');
const { generateInterviewQuestions, evaluateAnswer } = require('../services/aiService');

// Start a new interview session
router.post('/start', async (req, res) => {
  try {
    const { userId, technology } = req.body;

    if (!userId || !technology) {
      return res.status(400).json({ error: 'UserId and technology are required' });
    }

    if (!['MERN', 'C++', 'Java'].includes(technology)) {
      return res.status(400).json({ error: 'Invalid technology. Choose from MERN, C++, or Java' });
    }

    // Generate questions using AI
    const questions = await generateInterviewQuestions(technology, 5);

    // Create new interview session
    const session = new InterviewSession({
      userId,
      technology,
      questions,
      status: 'in-progress'
    });

    await session.save();

    res.json({
      sessionId: session._id,
      technology: session.technology,
      questions: session.questions,
      message: 'Interview started successfully'
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

// Submit an answer for a question
router.post('/:sessionId/answer', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionIndex, answer } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ error: 'Interview session already completed' });
    }

    if (questionIndex < 0 || questionIndex >= session.questions.length) {
      return res.status(400).json({ error: 'Invalid question index' });
    }

    const question = session.questions[questionIndex];

    // Evaluate answer using AI
    const evaluation = await evaluateAnswer(question, answer, session.technology);

    // Check if answer already exists for this question
    const existingAnswerIndex = session.answers.findIndex(
      a => a.question === question
    );

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      session.answers[existingAnswerIndex].answer = answer;
      session.answers[existingAnswerIndex].feedback = evaluation.feedback;
      session.answers[existingAnswerIndex].score = evaluation.score;
    } else {
      // Add new answer
      session.answers.push({
        question,
        answer,
        feedback: evaluation.feedback,
        score: evaluation.score
      });
    }

    // Calculate total score
    session.totalScore = session.answers.reduce((sum, a) => sum + a.score, 0) / session.answers.length;

    await session.save();

    res.json({
      feedback: evaluation.feedback,
      score: evaluation.score,
      totalScore: session.totalScore,
      message: 'Answer submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Get interview session details
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Complete interview session
router.post('/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    session.status = 'completed';
    session.completedAt = new Date();

    // Calculate final score
    if (session.answers.length > 0) {
      session.totalScore = session.answers.reduce((sum, a) => sum + a.score, 0) / session.answers.length;
    }

    await session.save();

    res.json({
      message: 'Interview completed successfully',
      session: session
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
});

// Get user's interview history
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'Failed to fetch interview history' });
  }
});

module.exports = router;

