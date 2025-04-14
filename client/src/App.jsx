import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useActiveDeliveryLock from './hooks/useActiveDeliveryLock';
import Login from './pages/Login';
import Register from './pages/Register';
import RouteInfo from './pages/RouteInfo';
import Profile from './pages/Profile';
import MenuButton from './components/MenuButton';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const AppWrapper = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const { locked, loading } = useActiveDeliveryLock();

  if (loading) return <div className="p-8 text-center">Checking order status...</div>;

  // Restrict access to only /route and /profile
  if (locked && !["/route", "/profile"].includes(location.pathname)) {
    return <Navigate to="/route" />;
  }

  return (
    <>
      {token && ["/route", "/profile"].includes(location.pathname) && <MenuButton />}
      <div className="h-screen overflow-hidden bg-gray-100">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/route" /> : <Login />} />
          <Route path="/register" element={<Navigate to="/route" />} />
          <Route path="/status" element={<Navigate to="/route" />} />
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
          <Route path="*" element={<Navigate to="/route" />} />
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
