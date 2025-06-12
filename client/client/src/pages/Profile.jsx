import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

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
      const res = await fetch(`${import.meta.env.VITE_AUTH_API}/auth/v1/user/${username}`, {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/stores')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowBackIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
            <div className="relative">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                  <PersonIcon className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1 capitalize">{user?.username || 'Loading...'}</h2>
                  <p className="text-orange-100">Member since {user ? new Date(user.created_at).getFullYear() : '...'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            
            {!error && !user && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
              </div>
            )}

            {user && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl">
                    <EmailIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl">
                    <PersonIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium text-gray-800">{user.user_type === 0 ? 'Customer' : 'Courier'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl">
                    <VerifiedIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <p className={`font-medium ${user.is_verified ? 'text-green-600' : 'text-amber-600'}`}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl">
                    <CalendarMonthIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-800">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => setShowModal(true)}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <LogoutIcon className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-xl">
              <ShoppingBagIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">Your order history will appear here</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.tracking_id}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
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
                      <p className="text-sm text-gray-600 flex-1">{order.restaurant_address}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <LocationOnIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-600 flex-1">{order.address}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-sm text-orange-600 group-hover:text-orange-700 font-medium">
                      View Details →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
              <div className="relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Leaving already?</h3>
                    <p className="text-orange-100">We'll miss you! 👋</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Are you sure you want to sign out of your Dine&Dash account?
              </p>
              <div className="flex gap-3">
                <button 
                  className="flex-1 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[0.98]"
                  onClick={() => setShowModal(false)}
                >
                  Stay Connected
                </button>
                <button
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[0.98]"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-2 md:p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-slideUp overflow-hidden my-2 md:my-0 max-h-[calc(100vh-1rem)] md:max-h-[90vh] flex flex-col">
            {/* Modal Header with Status Theme */}
            <div className={`p-6 text-white relative overflow-hidden ${
              selectedOrder.status === 'pending' 
                ? 'bg-gradient-to-r from-amber-400 to-orange-400' 
                : selectedOrder.status === 'in_transit'
                ? 'bg-gradient-to-r from-blue-400 to-indigo-400'
                : 'bg-gradient-to-r from-green-400 to-emerald-400'
            }`}>
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
              
              {/* Animated Background Pattern */}
              <div className="absolute -right-8 -top-8 opacity-20">
                {selectedOrder.status === 'pending' ? (
                  <PendingIcon style={{ fontSize: '120px' }} />
                ) : selectedOrder.status === 'in_transit' ? (
                  <LocalShippingIcon style={{ fontSize: '120px' }} />
                ) : (
                  <CheckCircleIcon style={{ fontSize: '120px' }} />
                )}
              </div>
              
              <div className="relative">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <ShoppingBagIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold">Order Details</h3>
                    </div>
                    <p className="text-white/90 font-medium">Order #{selectedOrder.order_id.slice(-8)}</p>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-3 md:space-y-5 overflow-y-auto flex-1">
              {/* Status Card */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedOrder.status === 'pending' 
                        ? 'bg-amber-100 text-amber-700' 
                        : selectedOrder.status === 'in_transit'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="capitalize">{selectedOrder.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Tracking ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-700">{selectedOrder.tracking_id.slice(-8)}</p>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2 px-2 md:px-0">
                  <div className={`flex flex-col items-center flex-1 ${
                    ['pending', 'in_transit', 'delivered'].includes(selectedOrder.status) ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      ['pending', 'in_transit', 'delivered'].includes(selectedOrder.status) 
                        ? 'bg-orange-100 border-2 border-orange-500' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <RestaurantIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs mt-1 font-medium hidden sm:block">Preparing</p>
                  </div>
                  
                  <div className={`flex flex-col items-center flex-1 ${
                    ['in_transit', 'delivered'].includes(selectedOrder.status) ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      ['in_transit', 'delivered'].includes(selectedOrder.status) 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <LocalShippingIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs mt-1 font-medium hidden sm:block">On the way</p>
                  </div>
                  
                  <div className={`flex flex-col items-center flex-1 ${
                    selectedOrder.status === 'delivered' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedOrder.status === 'delivered' 
                        ? 'bg-green-100 border-2 border-green-500' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs mt-1 font-medium hidden sm:block">Delivered</p>
                  </div>
                </div>
                
                {/* Progress Line */}
                <div className="absolute top-5 left-[15%] right-[15%] md:left-8 md:right-8 h-0.5 bg-gray-200">
                  <div className={`h-full bg-gradient-to-r from-orange-500 to-blue-500 transition-all duration-500 ${
                    selectedOrder.status === 'pending' ? 'w-0' 
                    : selectedOrder.status === 'in_transit' ? 'w-1/2'
                    : 'w-full'
                  }`} />
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-3">
                <div className="bg-orange-50 rounded-2xl p-3 md:p-4 border border-orange-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <RestaurantIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Pickup from</p>
                      <p className="text-gray-900 font-semibold mt-1">{selectedOrder.restaurant_address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-3 md:p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <LocationOnIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Deliver to</p>
                      <p className="text-gray-900 font-semibold mt-1">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Information */}
              <div className="bg-gray-50 rounded-2xl p-3 md:p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <CalendarMonthIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Order Date</p>
                    <p className="text-sm font-semibold text-gray-800">{formatDate(selectedOrder.delivery_date).split(',')[0]}</p>
                  </div>
                  <div className="text-center">
                    <AccessTimeIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Estimated Time</p>
                    <p className="text-sm font-semibold text-gray-800">{formatDate(selectedOrder.estimated_delivery_time).split(',')[1]}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <p className="text-xs text-gray-400 text-center sm:text-left">Last updated: {formatDate(selectedOrder.last_updated)}</p>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-sm w-full sm:w-auto"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;