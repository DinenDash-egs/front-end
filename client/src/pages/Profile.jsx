import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
      setError('User not authenticated');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8001/v1/auth/user/${username}`, {
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

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setShowModal(false);
    navigate('/');
  };

  return (
    <div
      data-theme="forest"
      className="flex items-center justify-center min-h-screen bg-base-200 p-4 w-screen"
    >
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">User Profile</h1>

        {/* Default profile picture */}
        <div className="flex justify-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=default"
                alt="User Avatar"
              />
            </div>
          </div>
        </div>

        {/* Error / Loading / User Info */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!error && !user && <p className="text-center text-gray-400">Loading...</p>}

        {user && (
          <div className="space-y-2 text-base text-center">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User Type:</strong> {user.user_type === 0 ? 'User' : 'Courier'}</p>
            <p><strong>Verified:</strong> {user.is_verified ? 'Yes' : 'No'}</p>
            <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
          </div>
        )}

        {/* Logout button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary text-white rounded-full"
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
                <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary text-white" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
