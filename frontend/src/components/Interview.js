import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Interview.css';

const Interview = () => {
  const { technology } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    startInterview();
  }, [technology]);

  useEffect(() => {
    initializeSpeechRecognition();
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let newFinalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            newFinalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Update final transcript reference
        if (newFinalTranscript) {
          finalTranscriptRef.current += newFinalTranscript;
        }

        // Update answer text with final + interim
        setCurrentAnswer(finalTranscriptRef.current + interimTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          // Silent failures for common issues
        } else {
          alert('Speech recognition error: ' + event.error);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        finalTranscriptRef.current = currentAnswer;
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
      // Save current answer as final transcript
      finalTranscriptRef.current = currentAnswer;
    }
  };

  const startInterview = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'anonymous';
      
      const response = await axios.post('/api/interviews/start', {
        userId,
        technology
      });

      setSessionId(response.data.sessionId);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error starting interview:', error);
      setError('Failed to start interview. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const response = await axios.post(`/api/interviews/${sessionId}/answer`, {
        questionIndex: currentQuestionIndex,
        answer: currentAnswer
      });

      setAnswers({
        ...answers,
        [currentQuestionIndex]: currentAnswer
      });

      setFeedback({
        score: response.data.score,
        feedback: response.data.feedback,
        totalScore: response.data.totalScore
      });

      setCurrentAnswer('');
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextAnswer = answers[currentQuestionIndex + 1] || '';
      setCurrentAnswer(nextAnswer);
      finalTranscriptRef.current = nextAnswer;
      setFeedback(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer = answers[currentQuestionIndex - 1] || '';
      setCurrentAnswer(prevAnswer);
      finalTranscriptRef.current = prevAnswer;
      setFeedback(null);
    }
  };

  const handleCompleteInterview = async () => {
    try {
      await axios.post(`/api/interviews/${sessionId}/complete`);
      navigate(`/results/${sessionId}`);
    } catch (error) {
      console.error('Error completing interview:', error);
      setError('Failed to complete interview. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Preparing your interview questions...</p>
      </div>
    );
  }

  if (error && !sessionId) {
    return (
      <div className="interview">
        <div className="container">
          <div className="card error">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="button" onClick={() => navigate('/')}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="interview">
      <div className="container">
        <div className="interview-header">
          <h1>{technology} Interview</h1>
          <button className="button button-secondary" onClick={() => navigate('/')}>
            Home
          </button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="progress-info">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Answered: {answeredQuestions}/{questions.length}</span>
        </div>

        {error && (
          <div className="error">{error}</div>
        )}

        <div className="card">
          <div className="question-section">
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p className="question-text">{currentQuestion}</p>
          </div>

          <div className="answer-section">
            <div className="answer-header">
              <label htmlFor="answer">Your Answer:</label>
              {recognition && (
                <div className="mic-controls">
                  {!isListening ? (
                    <button
                      type="button"
                      className="mic-button"
                      onClick={startListening}
                      title="Start voice recording"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                      <span>Start Voice</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="mic-button mic-button-recording"
                      onClick={stopListening}
                      title="Stop voice recording"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h12v12H6z"/>
                      </svg>
                      <span>Stop Recording</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <textarea
              id="answer"
              className="textarea"
              value={currentAnswer}
              onChange={(e) => {
                setCurrentAnswer(e.target.value);
                finalTranscriptRef.current = e.target.value;
              }}
              placeholder={recognition ? "Type your answer here or use the microphone to speak..." : "Type your answer here..."}
              rows="8"
            />
            {isListening && (
              <div className="recording-indicator">
                <span className="pulse"></span>
                <span>Listening... Speak your answer</span>
              </div>
            )}
          </div>

          {feedback && (
            <div className="feedback-section">
              <div className="feedback-card">
                <div className="score-badge">
                  Score: {feedback.score}/10
                </div>
                <p className="feedback-text">{feedback.feedback}</p>
                {feedback.totalScore && (
                  <p className="total-score">Overall Score: {feedback.totalScore.toFixed(1)}/10</p>
                )}
              </div>
            </div>
          )}

          <div className="interview-actions">
            <button
              className="button button-secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>

            <button
              className="button button-success"
              onClick={handleSubmitAnswer}
              disabled={submitting || !currentAnswer.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="button"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next Question
              </button>
            ) : (
              <button
                className="button button-success"
                onClick={handleCompleteInterview}
                disabled={answeredQuestions < questions.length}
              >
                Complete Interview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;

