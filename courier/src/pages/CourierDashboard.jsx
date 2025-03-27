import { useState } from 'react';

const CourierDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const handleGetOrder = () => {
    console.log('📦 Get New Order');
  };

  const handleOpenMap = () => {
    console.log('🗺️ Open Map');
  };

  const handleCancelOrder = () => {
    console.log('❌ Cancel Order');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setShowModal(false);
    console.log('Logged out');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4 w-screen">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Courier Dashboard</h1>

        {/* Main action buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGetOrder}
            className="btn btn-primary w-full rounded-full text-white text-base"
          >
            📦 Get New Order
          </button>

          <button
            onClick={handleOpenMap}
            className="btn btn-warning w-full rounded-full text-white text-base"
          >
            🗺️ Open Map
          </button>

          <button
            onClick={handleCancelOrder}
            className="btn btn-error w-full rounded-full text-white text-base"
          >
            ❌ Cancel Order
          </button>
        </div>

        {/* Logout */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-sm btn-neutral rounded-full text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
            <p className="py-4">Are you sure you want to log out?</p>
            <div className="modal-action">
              <div className="flex gap-3">
                <button
                  className="btn btn-warning rounded-full text-white"
                  onClick={() => setShowModal(false)}
                >
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
    </div>
  );
};

export default CourierDashboard;
