import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RouteInfo from './pages/RouteInfo';
import Profile from './pages/Profile';
import MenuButton from './components/MenuButton';
import StatusChecker from './pages/StatusChecker';
import Stores from './pages/Stores';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

// Wrapper component to use hooks like useLocation outside of Router
const AppWrapper = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const isProtectedPath = ["/route", "/profile"].includes(location.pathname);

  return (
    <>
      {/* Show MenuButton only if authenticated and on protected paths */}
      {token && isProtectedPath && <MenuButton />}

      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/status" element={<StatusChecker />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stores" element={<Stores />} />
          <Route
            path="/route"
            element={
              <ProtectedRoute>
                <RouteInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
