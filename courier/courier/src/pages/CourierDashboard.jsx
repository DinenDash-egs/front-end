import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

const CourierDashboard = () => {
  const [orders, setOrders] = useState([]);
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
      const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/deliveries?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // Sort with pending orders first, then by date DESC (newest first)
      const sorted = [...data].sort((a, b) => {
        // First priority: pending orders come first
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        
        // Second priority: sort by date DESC (newest first)
        return new Date(b.delivery_date) - new Date(a.delivery_date);
      });

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon className="w-4 h-4" />;
      case 'in_transit':
        return <LocalShippingIcon className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  useEffect(() => {
    fetchOrders(); // initial load

    const interval = setInterval(fetchOrders, 3000); // auto-refresh every 3s

    return () => clearInterval(interval); // clean up
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <DeliveryDiningIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Courier Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Orders Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-xl">
              <ShoppingBagIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Available Deliveries</h2>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No deliveries available</p>
                <p className="text-sm text-gray-400 mt-1">New orders will appear here</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.tracking_id}
                  className={`border rounded-2xl p-5 transition-all duration-200 ${
                    order.status === 'pending' 
                      ? 'border-amber-200 bg-amber-50 hover:shadow-md cursor-pointer' 
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">Order #{order.order_id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.delivery_date)}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <RestaurantIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Pickup from</p>
                        <p className="text-sm text-gray-700 font-medium">{order.restaurant_address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <LocationOnIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Deliver to</p>
                        <p className="text-sm text-gray-700 font-medium">{order.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AccessTimeIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Estimated delivery</p>
                        <p className="text-sm text-gray-700 font-medium">{formatDate(order.estimated_delivery_time)}</p>
                      </div>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleAccept(order.tracking_id)}
                      className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Accept Delivery
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <div className="mt-4 text-center">
                      <span className="text-sm text-green-600 font-medium">✓ Delivery completed</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierDashboard;
