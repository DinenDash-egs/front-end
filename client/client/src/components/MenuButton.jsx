// MenuButton.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const MenuButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const username = localStorage.getItem('username') || 'User';

  const isActive = (path) => location.pathname === path;

  const handleGoTo = (path) => () => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setShowModal(false);
    navigate('/');
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  // Poll active order every second
  useEffect(() => {
    const fetchActiveOrder = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/user/active/${username}`);
        setHasActiveOrder(res.status === 200);
      } catch (error) {
        console.error("Error checking active order:", error);
        setHasActiveOrder(false);
      }
    };

    fetchActiveOrder();
    const interval = setInterval(fetchActiveOrder, 1000);

    return () => clearInterval(interval);
  }, [username]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.menu-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className="fixed top-3 right-3 z-[9999]">
        <div className="menu-dropdown relative">
          {/* Main Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative group p-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl hover:from-orange-500 hover:to-amber-500 transition-all duration-300 ${
              isOpen ? 'shadow-md' : ''
            }`}
          >
            <div className="relative">
              <MenuIcon className="w-6 h-6 text-white" />
            </div>
            {hasActiveOrder && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </button>
          
          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-72 animate-slideIn">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
                {/* User Header */}
                <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                      <AccountCircleIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Welcome back,</p>
                      <p className="text-lg font-bold capitalize">{username}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-3">
                  <div className="space-y-1">
                    <button
                      onClick={handleGoTo('/profile')}
                      className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                        isActive('/profile') 
                          ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700' 
                          : 'hover:bg-orange-50 text-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition-colors ${
                        isActive('/profile') ? 'bg-orange-200' : 'bg-gray-100 group-hover:bg-orange-100'
                      }`}>
                        <PersonIcon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">My Profile</span>
                      {isActive('/profile') && (
                        <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                    </button>

                    {hasActiveOrder ? (
                      <button
                        onClick={handleGoTo('/route')}
                        className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                          isActive('/route') 
                            ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700' 
                            : 'hover:bg-orange-50 text-gray-700'
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors relative ${
                          isActive('/route') ? 'bg-orange-200' : 'bg-gray-100 group-hover:bg-orange-100'
                        }`}>
                          <LocalShippingIcon className="w-5 h-5" />
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <span className="font-medium block">Track Order</span>
                          <span className="text-xs text-green-600">Order in progress</span>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={handleGoTo('/stores')}
                        className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                          isActive('/stores') 
                            ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700' 
                            : 'hover:bg-orange-50 text-gray-700'
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors ${
                          isActive('/stores') ? 'bg-orange-200' : 'bg-gray-100 group-hover:bg-orange-100'
                        }`}>
                          <RestaurantIcon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Browse Restaurants</span>
                        {isActive('/stores') && (
                          <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="border-t border-gray-100 my-3"></div>

                  <button
                    onClick={() => {
                      setShowModal(true);
                      setIsOpen(false);
                    }}
                    className="w-full group flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-200"
                  >
                    <div className="p-2 bg-gray-100 group-hover:bg-red-100 rounded-xl transition-colors">
                      <LogoutIcon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
              <div className="relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Leaving already?</h3>
                    <p className="text-orange-100">We'll miss you! 👋</p>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Are you sure you want to sign out of your Dine&Dash account?
              </p>
              <div className="flex gap-3">
                <button 
                  className="flex-1 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[0.98]"
                  onClick={handleCancel}
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
    </>
  );
};

export default MenuButton;