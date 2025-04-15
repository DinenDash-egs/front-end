import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const OrderDelivered = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/stores');
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-base-200 flex flex-col items-center justify-center text-center space-y-6 px-6">
      <h1 className="text-2xl font-bold text-success">🎉 Order Delivered!</h1>
      <p className="text-base-content">
        Your delivery has been successfully completed.
      </p>
      <p className="text-sm text-gray-500">
        Redirecting in <span className="font-semibold">{secondsLeft}</span> second{secondsLeft !== 1 && 's'}...
      </p>
      <button
        className="btn btn-primary rounded-full px-6"
        onClick={() => navigate('/stores')}
      >
        Return to Restaurants
      </button>
    </div>
  );
};

export default OrderDelivered;
