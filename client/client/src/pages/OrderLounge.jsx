import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const OrderLounge = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/user/active/${username}`);
        if (res.status === 200) {
          const data = await res.json();
          if (data?.status === 'in_transit') {
            clearInterval(interval);
            navigate('/route');
          }
        }
      } catch (error) {
        console.error("Error checking order status:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
            
            {/* Animated Background Icon */}
            <div className="absolute -right-16 -top-16 opacity-10">
              <RestaurantIcon style={{ fontSize: '200px' }} className="animate-spin-slow" />
            </div>
            
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                <AccessTimeIcon className="w-12 h-12 text-white animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Order Received!</h1>
              <p className="text-orange-100">We're processing your order</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Status Message */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your order is being processed
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your order with the restaurant.
              </p>
            </div>

            {/* Loading Animation */}
            <div className="flex justify-center my-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderLounge;