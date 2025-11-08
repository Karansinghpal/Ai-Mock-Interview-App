import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'anonymous';
      const response = await axios.get(`/api/interviews/user/${userId}`);
      setSessions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to fetch interview history. Please try again.');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#28a745';
    if (score >= 6) return '#ffc107';
    return '#dc3545';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading interview history...</p>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="container">
        <div className="history-header">
          <h1>Interview History</h1>
          <button className="button button-secondary" onClick={() => navigate('/')}>
            Home
          </button>
        </div>

        {error && (
          <div className="card error">
            <p>{error}</p>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="card empty-state">
            <h2>No Interview History</h2>
            <p>You haven't completed any interviews yet. Start your first interview now!</p>
            <button className="button" onClick={() => navigate('/')}>
              Start Interview
            </button>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session) => (
              <div key={session._id} className="card session-card">
                <div className="session-header">
                  <div className="technology-badge" style={{ 
                    backgroundColor: session.technology === 'MERN' ? '#61dafb' : 
                                    session.technology === 'C++' ? '#00599c' : '#ed8b00'
                  }}>
                    {session.technology}
                  </div>
                  <div
                    className="session-score"
                    style={{ color: getScoreColor(session.totalScore) }}
                  >
                    {session.totalScore.toFixed(1)}/10
                  </div>
                </div>

                <div className="session-info">
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className={`status-badge ${session.status}`}>
                      {session.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Questions:</span>
                    <span className="info-value">{session.questions.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Answered:</span>
                    <span className="info-value">{session.answers.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{formatDate(session.createdAt)}</span>
                  </div>
                </div>

                <div className="session-actions">
                  <button
                    className="button"
                    onClick={() => navigate(`/results/${session._id}`)}
                  >
                    View Results
                  </button>
                  {session.status === 'in-progress' && (
                    <button
                      className="button button-secondary"
                      onClick={() => navigate(`/interview/${session.technology}`)}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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

export default History;

