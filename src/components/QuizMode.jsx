import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const saveQuizProgress = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/api/progress/quiz`, {
      score: score,
      totalQuestions: questions.length,
      timeTaken: (questions.length * 10) - timeLeft
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Quiz progress saved!');
  } catch (error) {
    console.error('Failed to save quiz progress:', error);
  }
};
const QuizMode = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);

  const signDescriptions = {
    'A': 'Fist with thumb extended to the side',
    'B': 'All fingers together pointing up, thumb across palm',
    'C': 'Curve all fingers to form a C shape',
    'D': 'Point index finger up, other fingers touch thumb',
    'E': 'Curl all fingers down over thumb',
    'F': 'Touch thumb and index fingertips, other fingers extended',
    'G': 'Point index finger and thumb sideways',
    'H': 'Extend index and middle fingers together horizontally',
    'I': 'Extend pinky finger upward, other fingers folded',
    'L': 'Make L shape with thumb and index finger',
    'O': 'Form circle with all fingertips touching',
    'R': 'Cross index and middle fingers',
    'S': 'Make a fist with thumb in front',
    'T': 'Tuck thumb between index and middle finger',
    'V': 'Make V with index and middle fingers',
    'W': 'Extend index, middle, and ring fingers',
    'Y': 'Extend thumb and pinky, fold other fingers'
  };

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const availableLetters = Object.keys(signDescriptions);
    const shuffled = [...availableLetters].sort(() => Math.random() - 0.5);
    const selectedLetters = shuffled.slice(0, 10);

    const quizQuestions = selectedLetters.map(letter => {
      const wrongAnswers = availableLetters
        .filter(l => l !== letter)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allAnswers = [letter, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        letter,
        description: signDescriptions[letter],
        answers: allAnswers,
        correctAnswer: letter
      };
    });

    setQuestions(quizQuestions);
  };

  useEffect(() => {
    if (!quizStarted || quizComplete || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(null);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, currentQuestion, selectedAnswer, quizComplete]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
       setCurrentQuestion(currentQuestion + 1);
       setSelectedAnswer(null);
       setShowResult(false);
       setTimeLeft(10);
       } else {
  setQuizComplete(true);
  saveQuizProgress();
  }
    }, 2000);
  };

  const restartQuiz = () => {
    generateQuestions();
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setTimeLeft(10);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(10);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">🎮 ISL Quiz Challenge</h1>
            <div className="text-6xl mb-6">🤟</div>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-bold text-lg mb-3 text-blue-900">📋 Quiz Rules:</h3>
              <ul className="space-y-2 text-blue-800">
                <li>✓ 10 questions about ISL signs</li>
                <li>✓ 10 seconds per question</li>
                <li>✓ Multiple choice answers</li>
                <li>✓ Score based on correct answers</li>
              </ul>
            </div>

            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-lg font-bold text-xl mb-4"
            >
              Start Quiz 🚀
            </button>

            <div className="mt-6">
              <Link to="/dashboard" className="text-blue-600 hover:underline">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = (score / questions.length) * 100;
    let message = '';
    let emoji = '';

    if (percentage >= 90) {
      message = 'Outstanding! You\'re an ISL master!';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = 'Great job! Keep practicing!';
      emoji = '🌟';
    } else if (percentage >= 50) {
      message = 'Good effort! Review the alphabet!';
      emoji = '📚';
    } else {
      message = 'Keep learning! Practice makes perfect!';
      emoji = '💪';
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-8xl mb-4">{emoji}</div>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
            <p className="text-2xl mb-6 text-gray-600">{message}</p>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mb-6 text-white">
              <p className="text-xl mb-2">Your Score</p>
              <p className="text-6xl font-bold">{score}/{questions.length}</p>
              <p className="text-3xl mt-2">{percentage.toFixed(0)}%</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={restartQuiz}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                🔄 Try Again
              </button>
              <Link
                to="/alphabet"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-center"
              >
                📖 Review Alphabet
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold text-center"
              >
                🏠 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Score: {score}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div className={`inline-block text-4xl font-bold ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>

          {/* Question */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-8 mb-6 text-center">
            <p className="text-gray-700 text-lg mb-4">Which letter is this sign?</p>
            <p className="text-2xl font-bold text-gray-800">{question.description}</p>
          </div>

          {/* Answers */}
          <div className="grid grid-cols-2 gap-4">
            {question.answers.map((answer) => {
              let buttonClass = 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300';
              
              if (showResult) {
                if (answer === question.correctAnswer) {
                  buttonClass = 'bg-green-500 text-white border-2 border-green-600';
                } else if (answer === selectedAnswer) {
                  buttonClass = 'bg-red-500 text-white border-2 border-red-600';
                } else {
                  buttonClass = 'bg-gray-100 text-gray-400 border-2 border-gray-300';
                }
              }

              return (
                <button
                  key={answer}
                  onClick={() => !showResult && handleAnswer(answer)}
                  disabled={showResult}
                  className={`${buttonClass} py-6 px-4 rounded-xl font-bold text-2xl transition disabled:cursor-not-allowed`}
                >
                  {answer}
                </button>
              );
            })}
          </div>

          {/* Result message */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-lg text-center text-white font-semibold text-lg ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isCorrect ? '✅ Correct!' : `❌ Wrong! Correct answer: ${question.correctAnswer}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizMode;
