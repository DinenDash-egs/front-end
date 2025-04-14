// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useActiveDeliveryLock from './hooks/useActiveDeliveryLock';
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
  const { locked, loading } = useActiveDeliveryLock();

  const protectedPaths = ["/stores", "/route", "/profile", "/store/"];
  const isProtectedPath = protectedPaths.some((p) =>
    location.pathname.startsWith(p)
  );

  if (loading) return <div className="p-8 text-center">Checking order status...</div>;

  // Force locked users to stay on /route
  if (locked && location.pathname !== "/route") {
    return <Navigate to="/route" />;
  }

  return (
    <>
      {token && isProtectedPath && <MenuButton />}
      <div className="h-screen overflow-hidden bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              token ? <Navigate to="/stores" /> : <Login />
            }
          />
          <Route path="/status" element={<StatusChecker />} />
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
