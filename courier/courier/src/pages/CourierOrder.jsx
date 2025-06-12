import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

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

  if (!order) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex justify-center items-center">
      <div className="text-center">
        <DeliveryDiningIcon className="w-16 h-16 text-orange-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600 font-medium">Loading delivery details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <LocalShippingIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Delivery In Progress</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          {/* Order Info Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-xl">
              <ShoppingBagIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Order #{order.order_id.slice(-8)}</h2>
              <p className="text-sm text-gray-500">Tracking ID: {order.tracking_id}</p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <PersonIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Customer</p>
                <p className="text-sm text-gray-700 font-medium">{order.customer_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <RestaurantIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Pickup from</p>
                <p className="text-sm text-gray-700 font-medium">{order.restaurant_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <LocationOnIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Deliver to</p>
                <p className="text-sm text-gray-700 font-medium">{order.address}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
              <LocalShippingIcon className="w-4 h-4" />
              <span className="capitalize">{order.status.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Complete Delivery Button */}
          <button
            onClick={handleComplete}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Complete Delivery
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourierOrder;
