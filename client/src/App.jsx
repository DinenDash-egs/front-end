import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RouteInfo from './pages/RouteInfo';
import Profile from './pages/Profile';
import MenuButton from './components/MenuButton';
import StatusChecker from './pages/StatusChecker';
import Stores from './pages/Stores';
import Products from './pages/Products';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const AppWrapper = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const protectedPaths = ["/route", "/profile", "/stores", "/store/"];

  const isProtectedPath = protectedPaths.some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <>
      {token && isProtectedPath && <MenuButton />}

      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/status" element={<StatusChecker />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <Stores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:storeName"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
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
