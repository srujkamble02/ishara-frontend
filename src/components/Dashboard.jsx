import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const lessons = [
    {
      id: 'alphabet',
      title: '🔤 ISL Alphabet (A-Z)',
      description: 'Learn all 26 letters of Indian Sign Language',
      level: 'Beginner',
      duration: '30 min',
      letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    },
    {
      id: 'numbers',
      title: '🔢 Numbers (0-10)',
      description: 'Learn to sign numbers in ISL',
      level: 'Beginner',
      duration: '15 min',
      letters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    {
      id: 'greetings',
      title: '👋 Common Greetings',
      description: 'Hello, Goodbye, Thank You, Sorry',
      level: 'Beginner',
      duration: '20 min',
      letters: ['HELLO', 'GOODBYE', 'THANK YOU', 'SORRY']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">🤟 Ishara</h1>
              <span className="text-gray-600">|</span>
              <span className="text-gray-600">Welcome, {user?.username || 'User'}!</span>
            </div>
            <div className="flex space-x-4">
              <Link 
                to="/camera"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                📹 Practice
              </Link>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Lessons Available</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{lessons.length}</p>
              </div>
              <div className="text-5xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Signs to Learn</p>
                <p className="text-4xl font-bold text-green-600 mt-2">37</p>
              </div>
              <div className="text-5xl">🖐️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Your Progress</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">0%</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🚀 Get Started!</h2>
          <p className="mb-6 text-blue-50">
            Learn Indian Sign Language step by step. Start with the alphabet and progress to words and phrases.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/camera"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              📹 Practice with Camera
            </Link>
            <button className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-semibold">
              📖 View All Lessons
            </button>
          </div>
        </div>

        {/* Lessons */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Learning Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{lesson.title}</h3>
                <p className="text-blue-50">{lesson.description}</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {lesson.level}
                  </span>
                  <span className="text-gray-600 text-sm">⏱️ {lesson.duration}</span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 font-semibold mb-2">
                    Signs included ({lesson.letters.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.letters.slice(0, 8).map((letter) => (
                      <span key={letter} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {letter}
                      </span>
                    ))}
                    {lesson.letters.length > 8 && (
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                        +{lesson.letters.length - 8} more
                      </span>
                    )}
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resources Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📖 Learning Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-lg mb-2">💡 Tips for Learning ISL</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Practice regularly - even 10 minutes daily helps!</li>
                <li>• Watch your hand positions carefully in the mirror</li>
                <li>• Start with the alphabet before moving to words</li>
                <li>• Use our camera tool to check your signs</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-lg mb-2">🎯 Your Learning Path</h3>
              <ol className="text-gray-700 space-y-2">
                <li>1️⃣ Master the ISL Alphabet (A-Z)</li>
                <li>2️⃣ Learn Numbers (0-10)</li>
                <li>3️⃣ Common greetings and phrases</li>
                <li>4️⃣ Practice with real-time detection</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
