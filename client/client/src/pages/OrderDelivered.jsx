import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HomeIcon from '@mui/icons-material/Home';

const OrderDelivered = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Simple Header */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Order Delivered</h1>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Simple Message */}
            <div className="text-center">
              <p className="text-gray-700">
                Your order has been delivered successfully.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/stores')}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Order Again
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="w-full px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-2xl transition-all duration-200"
              >
                View Order History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDelivered;