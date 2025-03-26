import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';

const MenuButton = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleGoProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setShowModal(false); // ✅ close modal
    navigate('/');
  };

  const handleCancel = () => {
    setShowModal(false); // ✅ close modal
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-[9999]">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn bg-base-100 p-6 btn-outline btn-sm rounded-full px-4">
            <SettingsIcon />
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow w-40 mt-2 p-2">
            <li>
              <a onClick={handleGoProfile}>Profile</a>
            </li>
            <li>
              <a onClick={() => setShowModal(true)}>Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
            <p className="py-4">Are you sure you want to log out?</p>
            <div className="modal-action">
              <div className="flex gap-3">
                <button className="btn" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-error text-white" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuButton;
