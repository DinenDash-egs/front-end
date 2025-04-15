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
import OrderLounge from './pages/OrderLounge';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const AppWrapper = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const { locked, loading } = useActiveDeliveryLock();

  const currentPath = location.pathname;

  // Pages that should always be accessible when the user is logged in
  const alwaysAccessiblePaths = ['/profile', '/route'];

  if (loading) {
    return <div className="p-8 text-center">Checking order status...</div>;
  }

  // User is locked and tries to access something outside /route or /profile
  if (locked && !alwaysAccessiblePaths.includes(currentPath)) {
    return <Navigate to="/route" />;
  }

  // User is not locked and tries to go to / or /register while logged in
  if (token && (currentPath === '/' || currentPath === '/register')) {
    return <Navigate to="/stores" />;
  }

  return (
    <>
      {token && <MenuButton />}
      <div className="h-screen overflow-auto bg-gray-100">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/stores" /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/stores" /> : <Register />} />
          <Route path="/status" element={<StatusChecker />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/route" element={<ProtectedRoute><RouteInfo /></ProtectedRoute>} />
          <Route path="/stores" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
          <Route path="/store/:storeName" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/order-lounge" element={<ProtectedRoute><OrderLounge /></ProtectedRoute>} />
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
