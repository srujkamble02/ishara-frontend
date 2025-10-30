import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CameraSignDetector from './components/CameraSignDetector';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/camera" element={<CameraSignDetector />} />
      </Routes>
    </Router>
  );
}

export default App;
