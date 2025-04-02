import React from 'react';

const StoreCard = ({ image, name, rating, price, time }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-200">
    <img src={image} alt={name} className="w-full h-44 object-cover" />
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold text-gray-800">{name}</h2>

      <div className="flex items-center justify-between text-sm">
        <span className="badge badge-success badge-outline">
          👍 {rating}%
        </span>
        <span className="badge badge-info badge-outline">
          ₦ {price.toFixed(2)}
        </span>
        <span className="badge badge-warning badge-outline">{time}</span>
      </div>

      <button className="btn btn-primary btn-sm w-full mt-2 rounded-full">
        Order Now
      </button>
    </div>
  </div>
);

const Stores = () => {
  const storeData = [
    {
      name: 'KFC',
      image: 'https://i.imgur.com/1bX5QH6.png',
      rating: 88,
      price: 450,
      time: '55–75 min',
    },
    {
      name: 'Debonairs Pizza',
      image: 'https://i.imgur.com/sIW2EaC.png',
      rating: 90,
      price: 450,
      time: '55–60 min',
    },
    {
      name: 'Boga Masta',
      image: 'https://i.imgur.com/5RW7x0A.png',
      rating: 90,
      price: 450,
      time: '55–60 min',
    },
  ];

  return (
    <div
      data-theme="forest"
      className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100 px-4 py-8 flex flex-col items-center"
    >
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🍔 Stores You Might Like
        </h1>

        {storeData.map((store, idx) => (
          <StoreCard key={idx} {...store} />
        ))}
      </div>
    </div>
  );
};

export default Stores;
