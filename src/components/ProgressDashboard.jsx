import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ProgressDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
    fetchLeaderboard();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Create a fake token for demo
        localStorage.setItem('token', 'demo-token');
      }
      
      const response = await axios.get(`${API_URL}/api/progress`, {
        headers: { Authorization: `Bearer ${token || 'demo-token'}` }
      });
      setProgress(response.data.progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Set demo data if API fails
      setProgress({
        signsLearned: [],
        quizHistory: [],
        streak: { current: 0, longest: 0 },
        achievements: [],
        stats: {
          totalQuizzesTaken: 0,
          totalSignsPracticed: 0,
          averageQuizScore: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/progress/leaderboard`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    }
  };

  const achievementBadges = {
    'first_quiz': { emoji: '🎯', color: 'bg-blue-500' },
    'quiz_master': { emoji: '🏆', color: 'bg-yellow-500' },
    'perfect_score': { emoji: '💯', color: 'bg-green-500' },
    'week_streak': { emoji: '🔥', color: 'bg-orange-500' },
    'alphabet_master': { emoji: '📚', color: 'bg-purple-500' },
    'high_scorer': { emoji: '⭐', color: 'bg-pink-500' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">📊 Your Progress</h1>
            <Link 
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-blue-100 text-sm">Quizzes Taken</p>
            <p className="text-4xl font-bold">{progress.stats.totalQuizzesTaken}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-green-100 text-sm">Average Score</p>
            <p className="text-4xl font-bold">{progress.stats.averageQuizScore.toFixed(0)}%</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-orange-100 text-sm">Current Streak</p>
            <p className="text-4xl font-bold">{progress.streak.current} days</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">🖐️</div>
            <p className="text-purple-100 text-sm">Signs Learned</p>
            <p className="text-4xl font-bold">{progress.signsLearned.length}/26</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">🏅</span> Achievements
            </h2>
            
            {progress.achievements.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {progress.achievements.map((ach) => {
                  const badge = achievementBadges[ach.badgeId] || { emoji: '🎖️', color: 'bg-gray-500' };
                  return (
                    <div key={ach.badgeId} className={`${badge.color} rounded-lg p-4 text-white text-center`}>
                      <div className="text-4xl mb-2">{badge.emoji}</div>
                      <p className="font-semibold text-sm">{ach.name}</p>
                      <p className="text-xs opacity-80 mt-1">
                        {new Date(ach.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-5xl mb-4">🎯</p>
                <p>Complete quizzes to unlock achievements!</p>
              </div>
            )}

            {/* Locked achievements */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 font-semibold mb-3">🔒 Locked Achievements:</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(achievementBadges)
                  .filter(([id]) => !progress.achievements.some(a => a.badgeId === id))
                  .map(([id, badge]) => (
                    <div key={id} className="bg-gray-100 rounded-lg p-3 text-center opacity-50">
                      <div className="text-2xl mb-1">{badge.emoji}</div>
                      <p className="text-xs text-gray-600">???</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Quiz History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">📜</span> Recent Quiz History
            </h2>
            
            {progress.quizHistory.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {progress.quizHistory.slice(-10).reverse().map((quiz, index) => {
                  const percentage = (quiz.score / quiz.totalQuestions) * 100;
                  const color = percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red';
                  
                  return (
                    <div key={index} className="border-l-4 border-gray-300 pl-4 py-2 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Quiz #{progress.quizHistory.length - index}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(quiz.completedAt).toLocaleDateString()} at {new Date(quiz.completedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold text-${color}-600`}>
                            {quiz.score}/{quiz.totalQuestions}
                          </p>
                          <p className="text-sm text-gray-600">{percentage.toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-5xl mb-4">📝</p>
                <p>No quiz history yet!</p>
                <Link to="/quiz" className="text-blue-600 hover:underline mt-2 inline-block">
                  Take your first quiz →
                </Link>
              </div>
            )}
          </div>

          {/* Signs Learned */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">🖐️</span> Signs Mastered
            </h2>
            
            {progress.signsLearned.length > 0 ? (
              <div className="grid grid-cols-6 gap-3">
                {progress.signsLearned.map((sign) => (
                  <div key={sign.letter} className="bg-blue-100 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{sign.letter}</p>
                    <p className="text-xs text-blue-800 mt-1">{sign.averageAccuracy.toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-5xl mb-4">🤟</p>
                <p>Start practicing to track your progress!</p>
              </div>
            )}

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Alphabet Progress</span>
                <span>{progress.signsLearned.length}/26</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${(progress.signsLearned.length / 26) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">🏆</span> Global Leaderboard
            </h2>
            
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((user, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${user.rank}`}
                      </span>
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-xs text-gray-600">
                          {user.quizzesTaken} quizzes • {user.streak}🔥
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">{user.averageScore}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-5xl mb-4">🏆</p>
                <p>Be the first on the leaderboard!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
