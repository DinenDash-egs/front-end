import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CourierOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchOrder = async () => {
    const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/deliveries/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrder(data);
  };

  const handleComplete = async () => {
    const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/deliveries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'delivered' }),
    });

    if (res.ok) {
      document.cookie = "active_delivery=; Max-Age=0;";
      navigate('/');
    } else {
      alert("❌ Failed to complete delivery.");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 p-6">
      <div className="w-full max-w-md bg-base-100 rounded-xl shadow-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-center text-primary">🚚 Delivery In Progress</h2>

        <div className="text-sm"><strong>Customer:</strong> {order.customer_name}</div>
        <div className="text-sm"><strong>Order ID:</strong> {order.order_id}</div>
        <div className="text-sm"><strong>Restaurant:</strong> {order.restaurant_address}</div>
        <div className="text-sm"><strong>Delivery to:</strong> {order.address}</div>
        <div className="text-sm">
          <strong>Status:</strong> <span className="badge badge-info">{order.status}</span>
        </div>

        <button
          onClick={handleComplete}
          className="btn btn-success w-full rounded-full text-white mt-4"
        >
          ✅ Complete Delivery
        </button>
      </div>
    </div>
  );
};

export default CourierOrder;
