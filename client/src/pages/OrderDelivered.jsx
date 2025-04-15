const OrderDelivered = () => {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-green-50 text-center px-6">
        <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Order Delivered!</h1>
        <p className="text-gray-700 mb-6">
          Your order has been successfully delivered. Thanks for choosing us!
        </p>
        <a href="/stores" className="btn btn-primary rounded-full">
          Back to Restaurants
        </a>
      </div>
    );
  };
  
  export default OrderDelivered;
  