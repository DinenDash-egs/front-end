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
    <div className="p-6 w-screen mx-auto bg-primary-content min-h-screen flex flex-col justify-between">
      <div className='text-primary'>
        <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {!error && !user && <p className="text-center text-white">Loading...</p>}

        {user && (
          <div className="space-y-2 text-lg text-black">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User Type:</strong> {user.user_type === 0 ? 'User' : 'Courier'}</p>
            <p><strong>Verified:</strong> {user.is_verified ? 'Yes' : 'No'}</p>
            <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Logout button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-white"
        >
          Logout
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center">
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
