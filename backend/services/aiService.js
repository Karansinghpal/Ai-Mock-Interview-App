const axios = require('axios');

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Technology-specific topics
const technologyTopics = {
  'MERN': [
    'React hooks and lifecycle',
    'Node.js and Express',
    'MongoDB queries and aggregation',
    'RESTful API design',
    'State management',
    'Component architecture',
    'Async/await and promises',
    'Middleware in Express',
    'MongoDB schema design',
    'Authentication and authorization'
  ],
  'C++': [
    'Object-oriented programming',
    'Memory management',
    'Templates and STL',
    'Pointers and references',
    'Data structures',
    'Algorithms',
    'Inheritance and polymorphism',
    'Virtual functions',
    'Operator overloading',
    'Exception handling'
  ],
  'Java': [
    'Object-oriented programming',
    'Collections framework',
    'Multithreading',
    'Exception handling',
    'Java 8 features (Streams, Lambdas)',
    'Spring Framework',
    'Design patterns',
    'Memory management (JVM)',
    'Generics',
    'Annotations and reflection'
  ]
};

async function generateInterviewQuestions(technology, numberOfQuestions = 5) {
  try {
    const topics = technologyTopics[technology] || [];
    const topicsList = topics.join(', ');

    const prompt = `Generate ${numberOfQuestions} interview questions for ${technology} technology. 
    Focus on these topics: ${topicsList}.
    Make questions practical and suitable for intermediate to advanced level.
    Return only the questions, one per line, without numbering or bullets.
    Each question should be clear and test practical knowledge.`;

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert technical interviewer. Generate clear, practical interview questions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:3001',
          'X-Title': 'AI Interview Prep App'
        }
      }
    );

    const questionsText = response.data.choices[0].message.content;
    const questions = questionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.match(/^\d+[\.\)]/))
      .slice(0, numberOfQuestions);

    return questions.length > 0 ? questions : generateFallbackQuestions(technology, numberOfQuestions);
  } catch (error) {
    console.error('Error generating questions with OpenRouter:', error.response?.data || error.message);
    // Fallback to predefined questions if API fails
    return generateFallbackQuestions(technology, numberOfQuestions);
  }
}

function generateFallbackQuestions(technology, numberOfQuestions) {
  const fallbackQuestions = {
    'MERN': [
      'Explain the difference between React class components and functional components.',
      'What is the purpose of middleware in Express.js? Give an example.',
      'How does MongoDB differ from SQL databases?',
      'Explain the concept of props and state in React.',
      'What is RESTful API? Explain its principles.',
      'How do you handle asynchronous operations in Node.js?',
      'What is the virtual DOM in React?',
      'Explain MongoDB aggregation pipeline.',
      'What are React hooks? Name some commonly used hooks.',
      'How do you implement authentication in a MERN stack application?'
    ],
    'C++': [
      'What is the difference between a pointer and a reference in C++?',
      'Explain the concept of virtual functions and polymorphism.',
      'What is RAII (Resource Acquisition Is Initialization)?',
      'How does memory management work in C++?',
      'Explain the difference between stack and heap memory.',
      'What are templates in C++? Provide an example.',
      'Explain the concept of smart pointers.',
      'What is the difference between const and constexpr?',
      'How does inheritance work in C++?',
      'Explain exception handling in C++.'
    ],
    'Java': [
      'What is the difference between ArrayList and LinkedList?',
      'Explain the concept of multithreading in Java.',
      'What are Java 8 Streams? Provide an example.',
      'Explain the difference between checked and unchecked exceptions.',
      'What is the Spring Framework? Name its key features.',
      'Explain the concept of garbage collection in Java.',
      'What are design patterns? Name some common ones.',
      'What is the difference between == and equals() in Java?',
      'Explain the concept of generics in Java.',
      'What is the difference between interface and abstract class?'
    ]
  };

  const questions = fallbackQuestions[technology] || [];
  return questions.slice(0, numberOfQuestions);
}

async function evaluateAnswer(question, answer, technology) {
  try {
    const prompt = `Evaluate the following interview answer for ${technology}:
    
Question: ${question}
Answer: ${answer}

Provide:
1. A brief feedback (2-3 sentences) on the answer quality
2. A score from 0 to 10 based on correctness, completeness, and clarity

Format: Feedback: [your feedback] | Score: [0-10]`;

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert technical interviewer. Evaluate answers objectively and provide constructive feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:3001',
          'X-Title': 'AI Interview Prep App'
        }
      }
    );

    const evaluation = response.data.choices[0].message.content;
    const feedbackMatch = evaluation.match(/Feedback:\s*(.+?)(?:\s*\||$)/i);
    const scoreMatch = evaluation.match(/Score:\s*(\d+)/i);

    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Answer submitted successfully.';
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

    return {
      feedback: feedback,
      score: Math.min(10, Math.max(0, score))
    };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return {
      feedback: 'Your answer has been recorded. Keep practicing!',
      score: 5
    };
  }
}

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer
};

