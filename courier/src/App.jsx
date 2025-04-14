import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CourierDashboard from './pages/CourierDashboard';
import CourierOrder from './pages/CourierOrder';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/courier" element={<CourierDashboard />} />
        <Route path="/courier/order/:id" element={<CourierOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
