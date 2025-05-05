import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="h-screen w-screen flex items-center justify-center bg-base-200">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">⌛ Please wait</h2>
        <p>Your order is being processed. This screen will update automatically once it's accepted.</p>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </div>
  );
};

export default OrderLounge;
