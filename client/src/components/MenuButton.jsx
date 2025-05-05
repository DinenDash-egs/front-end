// MenuButton.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';

const MenuButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleGoTo = (path) => () => {
    navigate(path);
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
    const username = localStorage.getItem('username');

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
  }, []);

  return (
    <>
      <div className="fixed top-4 right-4 z-[9999]">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn bg-base-100 p-6 btn-outline btn-sm rounded-full px-4"
          >
            <SettingsIcon />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box shadow w-40 mt-2 p-2"
          >
            <li>
              <a
                onClick={handleGoTo('/profile')}
                className={isActive('/profile') ? 'bg-primary text-white font-semibold rounded' : ''}
              >
                Profile
              </a>
            </li>

            {hasActiveOrder ? (
              <li>
                <a
                  onClick={handleGoTo('/route')}
                  className={isActive('/route') ? 'bg-primary text-white font-semibold rounded' : ''}
                >
                  Active Order
                </a>
              </li>
            ) : (
              <li>
                <a
                  onClick={handleGoTo('/stores')}
                  className={isActive('/stores') ? 'bg-primary text-white font-semibold rounded' : ''}
                >
                  Restaurants
                </a>
              </li>
            )}

            <li>
              <a onClick={() => setShowModal(true)}>Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div className="modal modal-open fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
            <p className="py-4">Are you sure you want to log out?</p>
            <div className="modal-action">
              <div className="flex gap-3">
                <button className="btn rounded-full btn-warning" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary rounded-full text-white"
                  onClick={handleLogout}
                >
                  Logout
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
