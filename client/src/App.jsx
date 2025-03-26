import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RouteInfo from './pages/RouteInfo';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Landing Page */}
          <Route path="/register" element={<Register />} />
          <Route path="/route" element={<RouteInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;