import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_AUTH_API}/v1/auth/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'User not found');
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch orders');

      const data = await res.json();
      const sorted = [...data].sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date));
      setOrders(sorted);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    if (!token || !username) {
      setError('User not authenticated');
      return;
    }
    fetchUser();
    fetchUserOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4 w-screen">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">👤 Profile</h1>

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=default" alt="User Avatar" />
            </div>
          </div>
        </div>

        {/* User Info */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!error && !user && <p className="text-center text-gray-400">Loading...</p>}
        {user && (
          <div className="space-y-1 text-sm text-center">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Type:</strong> {user.user_type === 0 ? 'User' : 'Courier'}</p>
            <p><strong>Verified:</strong> {user.is_verified ? 'Yes' : 'No'}</p>
            <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleString()}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-sm btn-neutral rounded-full text-white"
          >
            Logout
          </button>
        </div>

        <h2 className="text-xl font-bold mt-6 text-center text-primary">📦 My Orders</h2>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-sm text-center text-gray-500">No orders found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.tracking_id}
                className="bg-base-200 rounded-xl p-4 flex flex-col space-y-1 shadow cursor-pointer hover:bg-base-300 transition"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderModal(true);
                }}
              >
                <div className="text-sm font-medium">
                  <strong>Order:</strong> {order.order_id}
                </div>
                <div className="text-sm">
                  <strong>Status:</strong>{' '}
                  <span className={`badge ${
                    order.status === 'pending'
                      ? 'badge-warning'
                      : order.status === 'in_transit'
                      ? 'badge-info'
                      : 'badge-success'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm"><strong>To:</strong> {order.address}</div>
                <div className="text-sm"><strong>From:</strong> {order.restaurant_address}</div>
                <div className="text-sm text-gray-500">
                  <strong>Date:</strong> {formatDate(order.delivery_date)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div className="modal modal-open fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
            <p className="py-4">Are you sure you want to log out?</p>
            <div className="modal-action">
              <div className="flex gap-3">
                <button className="btn btn-warning rounded-full text-white" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary rounded-full text-white" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Info Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal modal-open fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="modal-box max-w-md w-full">
            <h3 className="font-bold text-lg">Order Details</h3>
            <div className="py-4 text-sm space-y-1">
              <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
              <p><strong>Tracking ID:</strong> {selectedOrder.tracking_id}</p>
              <p><strong>Status:</strong> <span className={`badge ${
                selectedOrder.status === 'pending'
                  ? 'badge-warning'
                  : selectedOrder.status === 'in_transit'
                  ? 'badge-info'
                  : 'badge-success'
              }`}>
                {selectedOrder.status}
              </span></p>
              <p><strong>Delivery Address:</strong> {selectedOrder.address}</p>
              <p><strong>Restaurant Address:</strong> {selectedOrder.restaurant_address}</p>
              <p><strong>Estimated Time:</strong> {formatDate(selectedOrder.estimated_delivery_time)}</p>
              <p><strong>Last Updated:</strong> {formatDate(selectedOrder.last_updated)}</p>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary rounded-full text-white" onClick={() => setShowOrderModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
