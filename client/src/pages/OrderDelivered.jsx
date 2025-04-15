import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const OrderDelivered = () => {
  const navigate = useNavigate();

  // autoredirect
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/stores');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-base-200 flex flex-col items-center justify-center text-center space-y-6 px-6">
      <h1 className="text-2xl font-bold text-success">🎉 Order Delivered!</h1>
      <p className="text-base-content">
        Your delivery has been successfully completed. We hope you enjoyed your meal!
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
