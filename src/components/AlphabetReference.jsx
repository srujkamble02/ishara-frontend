import { useState } from 'react';
import { Link } from 'react-router-dom';

const AlphabetReference = () => {
  const [selectedLetter, setSelectedLetter] = useState('A');
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  // ISL descriptions for each letter
  const signDescriptions = {
    'A': 'Make a fist with thumb extended to the side',
    'B': 'Hold all fingers together pointing up, thumb across palm',
    'C': 'Curve all fingers to form a C shape',
    'D': 'Point index finger up, other fingers touch thumb',
    'E': 'Curl all fingers down over thumb',
    'F': 'Touch thumb and index fingertips, other fingers extended',
    'G': 'Point index finger and thumb sideways',
    'H': 'Extend index and middle fingers together horizontally',
    'I': 'Extend pinky finger upward, other fingers folded',
    'J': 'Draw a J shape in the air with pinky finger',
    'K': 'Extend index and middle fingers in V shape, thumb between them',
    'L': 'Make L shape with thumb and index finger',
    'M': 'Fold thumb under three fingers',
    'N': 'Fold thumb under two fingers',
    'O': 'Form circle with all fingertips touching',
    'P': 'Point index and middle fingers down',
    'Q': 'Point index finger and thumb downward',
    'R': 'Cross index and middle fingers',
    'S': 'Make a fist with thumb in front',
    'T': 'Tuck thumb between index and middle finger in fist',
    'U': 'Extend index and middle fingers together upward',
    'V': 'Make V with index and middle fingers',
    'W': 'Extend index, middle, and ring fingers',
    'X': 'Bend index finger into hook shape',
    'Y': 'Extend thumb and pinky, fold other fingers',
    'Z': 'Draw Z shape in the air with index finger'
  };

  const tips = {
    'A': 'Keep your fist tight, thumb should point sideways not up',
    'B': 'Fingers should be straight and together, thumb flat across palm',
    'C': 'Maintain the curve, dont close into O shape',
    'D': 'Index finger should point straight up',
    'E': 'All fingertips should touch the top of your palm',
    'F': 'Circle between thumb and index should be clear',
    'G': 'Point sideways like pointing at something',
    'H': 'Fingers should be together and horizontal',
    'I': 'Only pinky up, make sure other fingers are tucked',
    'J': 'Draw the J motion smoothly',
    'K': 'Three distinct parts: index, middle, and thumb',
    'L': 'Clear 90-degree angle',
    'M': 'Three fingers over thumb',
    'N': 'Two fingers over thumb',
    'O': 'Perfect circle with all fingers',
    'P': 'Fingers point down at 45-degree angle',
    'Q': 'Similar to P but both fingers and thumb point down',
    'R': 'Fingers should be crossed, not just touching',
    'S': 'Thumb clearly visible in front',
    'T': 'Thumb tucked between first two fingers',
    'U': 'Two fingers together, straight up',
    'V': 'Clear V shape, fingers apart',
    'W': 'Three fingers extended and separated',
    'X': 'Hook shape with index finger',
    'Y': 'Shaka sign - thumb and pinky out',
    'Z': 'Draw a clear Z in the air'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">🔤 ISL Alphabet Reference</h1>
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
        
        {/* Alphabet Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Select a Letter</h2>
          <div className="grid grid-cols-7 md:grid-cols-13 gap-2">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`p-4 rounded-lg font-bold text-xl transition ${
                  selectedLetter === letter
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Letter Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Visual Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-6xl font-bold text-blue-600 mb-2">{selectedLetter}</h3>
              <p className="text-gray-600">ISL Sign for Letter {selectedLetter}</p>
            </div>
            
            {/* Placeholder for sign image/video */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-12 flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-9xl mb-4">🤟</div>
                <p className="text-gray-600 text-sm">
                  Visual demonstration placeholder
                </p>
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
              <span className="mr-2">▶️</span> Play Video Tutorial
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📝</span> How to Make This Sign
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {signDescriptions[selectedLetter]}
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">💡</span> Pro Tip
              </h3>
              <p className="text-yellow-900 leading-relaxed">
                {tips[selectedLetter]}
              </p>
            </div>

            {/* Practice Button */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Ready to Practice?</h3>
              <p className="mb-4 text-blue-50">
                Try making this sign in front of your camera and get real-time feedback!
              </p>
              <Link
                to="/camera"
                className="block w-full bg-white text-blue-600 py-3 rounded-lg font-semibold text-center hover:bg-blue-50"
              >
                📹 Open Camera Practice
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  const currentIndex = alphabet.indexOf(selectedLetter);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : alphabet.length - 1;
                  setSelectedLetter(alphabet[prevIndex]);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  const currentIndex = alphabet.indexOf(selectedLetter);
                  const nextIndex = currentIndex < alphabet.length - 1 ? currentIndex + 1 : 0;
                  setSelectedLetter(alphabet[nextIndex]);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Quick Reference Guide</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <div className="flex items-start">
                  <span className="text-3xl font-bold text-blue-600 mr-3">{letter}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {signDescriptions[letter]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetReference;
