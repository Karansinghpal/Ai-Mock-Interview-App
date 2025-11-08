import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Results.css';

const Results = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/interviews/${sessionId}`);
      setSession(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to fetch results. Please try again.');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#28a745';
    if (score >= 6) return '#ffc107';
    return '#dc3545';
  };

  const getPerformanceMessage = (score) => {
    if (score >= 8) return 'Excellent! You have a strong understanding.';
    if (score >= 6) return 'Good job! Keep practicing to improve further.';
    return 'Keep practicing! Review the concepts and try again.';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="results">
        <div className="container">
          <div className="card error">
            <h2>Error</h2>
            <p>{error || 'Session not found'}</p>
            <button className="button" onClick={() => navigate('/')}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalScore = session.totalScore || 0;
  const scorePercentage = (totalScore / 10) * 100;

  return (
    <div className="results">
      <div className="container">
        <div className="results-header">
          <h1>Interview Results</h1>
          <button className="button button-secondary" onClick={() => navigate('/')}>
            Home
          </button>
        </div>

        <div className="card results-summary">
          <div className="summary-header">
            <h2>{session.technology} Interview Results</h2>
            <div className="score-circle" style={{ borderColor: getScoreColor(totalScore) }}>
              <div className="score-value" style={{ color: getScoreColor(totalScore) }}>
                {totalScore.toFixed(1)}
              </div>
              <div className="score-max">/ 10</div>
            </div>
          </div>

          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${scorePercentage}%`,
                backgroundColor: getScoreColor(totalScore)
              }}
            ></div>
          </div>

          <p className="performance-message" style={{ color: getScoreColor(totalScore) }}>
            {getPerformanceMessage(totalScore)}
          </p>

          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Questions:</span>
              <span className="stat-value">{session.questions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Answered:</span>
              <span className="stat-value">{session.answers.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Score:</span>
              <span className="stat-value">{totalScore.toFixed(1)}/10</span>
            </div>
          </div>
        </div>

        <div className="answers-section">
          <h2>Detailed Feedback</h2>
          {session.answers.map((answer, index) => (
            <div key={index} className="card answer-card">
              <div className="answer-header">
                <h3>Question {index + 1}</h3>
                <div
                  className="answer-score"
                  style={{ backgroundColor: getScoreColor(answer.score) }}
                >
                  {answer.score}/10
                </div>
              </div>
              <p className="question-text">{answer.question}</p>
              <div className="answer-content">
                <h4>Your Answer:</h4>
                <p>{answer.answer}</p>
              </div>
              <div className="feedback-content">
                <h4>Feedback:</h4>
                <p>{answer.feedback}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="results-actions">
          <button
            className="button"
            onClick={() => navigate(`/interview/${session.technology}`)}
          >
            Take Another {session.technology} Interview
          </button>
          <button
            className="button button-secondary"
            onClick={() => navigate('/history')}
          >
            View History
          </button>
        </div>

        <div className="footer">
          <p>Developed by <a href="https://github.com/Karansinghpal" target="_blank" rel="noopener noreferrer" className="github-link">Karan Singh Pal</a></p>
          <a href="https://github.com/Karansinghpal" target="_blank" rel="noopener noreferrer" className="github-icon" title="View on GitHub">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Results;

