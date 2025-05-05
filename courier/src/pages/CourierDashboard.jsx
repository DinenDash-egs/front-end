import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CourierDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

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

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/deliveries`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // Sort by date DESC (newest first)
      const sorted = [...data].sort(
        (a, b) => new Date(b.delivery_date) - new Date(a.delivery_date)
      );

      setOrders(sorted);

      const active = sorted.find((o) => o.status === 'in_transit');
      if (active) {
        document.cookie = `active_delivery=${active.tracking_id}`;
        navigate(`/courier/order/${active.tracking_id}`);
      }
    } catch (err) {
      console.error('❌ Failed to fetch deliveries:', err);
    }
  };

  const handleAccept = async (tracking_id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/deliveries/${tracking_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'in_transit' }),
      });
      if (!res.ok) throw new Error('Failed to accept order');

      document.cookie = `active_delivery=${tracking_id}`;
      navigate(`/courier/order/${tracking_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "active_delivery=; Max-Age=0;";
    setShowModal(false);
    window.location.href = '/';
  };

  useEffect(() => {
    fetchOrders(); // initial load

    const interval = setInterval(fetchOrders, 3000); // auto-refresh every 3s

    return () => clearInterval(interval); // clean up
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4 w-screen">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">📋 Orders</h1>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-sm text-center text-gray-500">No deliveries found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.tracking_id}
                className="bg-base-200 rounded-xl p-4 flex flex-col space-y-1 shadow"
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
                <div className="text-sm text-gray-500">
                  <strong>Date:</strong> {formatDate(order.delivery_date)}
                </div>

                {order.status === 'pending' && (
                  <button
                    onClick={() => handleAccept(order.tracking_id)}
                    className="btn btn-primary btn-sm mt-2 w-full rounded-full text-white"
                  >
                    ✅ Accept Order
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-sm btn-neutral rounded-full text-white"
          >
            Logout
          </button>
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
    </div>
  );
};

export default CourierDashboard;
