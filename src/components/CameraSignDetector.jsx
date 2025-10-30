import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const CameraSignDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [handsDetected, setHandsDetected] = useState(false);

  const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // Load TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading model...');
        const loadedModel = await tf.loadGraphModel('/models/model.json');
        setModel(loadedModel);
        console.log('✅ Model loaded!');
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load ML model');
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  // Initialize MediaPipe Hands and Camera
  useEffect(() => {
    if (!model) return;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });
      camera.start();
    }

    return () => {
      hands.close();
    };
  }, [model]);

  // Process hand landmarks and run inference
  const onResults = async (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = results.image.width;
    canvas.height = results.image.height;
    
    // Draw video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      setHandsDetected(true);
      
      // Draw hand landmarks
      drawLandmarks(ctx, landmarks, canvas.width, canvas.height);
      
      // Extract features for ML model
      const features = extractFeatures(landmarks);
      
      // Run inference
      if (model) {
        try {
          const inputTensor = tf.tensor2d([features]);
          const predictions = model.predict(inputTensor);
          const probabilities = await predictions.data();
          
          const maxIndex = probabilities.indexOf(Math.max(...probabilities));
          const maxConfidence = probabilities[maxIndex];
          
          if (maxConfidence > 0.2) {
            setPrediction(LABELS[maxIndex]);
            setConfidence(maxConfidence);
          }
          
          inputTensor.dispose();
          predictions.dispose();
        } catch (err) {
          console.error('Inference error:', err);
        }
      }
    } else {
      setHandsDetected(false);
      setPrediction('');
    }
  };

  // Extract normalized features from landmarks
  const extractFeatures = (landmarks) => {
    const features = [];
    const wrist = landmarks[0];
    
    for (let i = 0; i < landmarks.length; i++) {
      features.push(
        landmarks[i].x - wrist.x,
        landmarks[i].y - wrist.y,
        landmarks[i].z - wrist.z
      );
    }
    
    return features;
  };

  // Draw hand landmarks on canvas
  const drawLandmarks = (ctx, landmarks, width, height) => {
    // Draw connections
    const connections = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20]
    ];

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    
    connections.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height);
      ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height);
      ctx.stroke();
    });

    // Draw points
    ctx.fillStyle = '#FF0000';
    landmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 p-6 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            🖐️ Real-time Hand Sign Detection
          </h2>
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading ML model & MediaPipe...</p>
            </div>
          )}

          {!isLoading && (
            <>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="hidden"
                  playsInline
                  autoPlay
                />
                <canvas
                  ref={canvasRef}
                  className="w-full rounded-lg"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm mb-1">
                        {handsDetected ? '✋ Hand Detected' : '🚫 No Hand Detected'}
                      </p>
                      <p className="text-5xl font-bold text-white">
                        {prediction || '...'}
                      </p>
                      {prediction && (
                        <p className="text-gray-300 text-sm mt-1">
                          Confidence: {(confidence * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                    
                    {prediction && (
                      <button
                        onClick={() => speak(prediction)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                      >
                        🔊 Speak
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📝 Instructions:</h3>
                <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                  <li>✅ MediaPipe Hands tracking active</li>
                  <li>Green lines and red dots show your hand skeleton</li>
                  <li>Position your hand clearly in front of the camera</li>
                  <li>Make ISL letter signs (A-Z)</li>
                  <li>Model will predict the sign you're making</li>
                </ul>
              </div>

              {!handsDetected && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    👋 Show your hand to the camera to start detection
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-white hover:underline text-lg">← Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default CameraSignDetector;
