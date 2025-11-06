import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CameraSignDetector from './components/CameraSignDetector';
import AlphabetReference from './components/AlphabetReference';
import QuizMode from './components/QuizMode';
import ProgressDashboard from './components/ProgressDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/quiz" element={<QuizMode />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/camera" element={<CameraSignDetector />} />
        <Route path="/alphabet" element={<AlphabetReference />} />
        <Route path="/progress" element={<ProgressDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
