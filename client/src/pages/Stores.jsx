import React from 'react';
import { useNavigate } from 'react-router-dom';

const StoreCard = ({ image, name, rating, time }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden">
      <img src={image} alt={name} className="w-full h-44 object-cover rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>

        <div className="flex items-center justify-between text-sm">
          <span className="badge badge-success">👍 {rating}%</span>
          <span className="badge badge-warning">{time}</span>
        </div>

        <button
          className="btn btn-primary btn-sm w-full rounded-full"
          onClick={() => navigate(`/store/${name.toLowerCase()}`)}
        >
          Order Now
        </button>
      </div>
    </div>
  );
};


const Stores = () => {
  const storeData = [
    {
      name: 'KFC',
      image: 'https://i.imgur.com/uu3GKCh.jpeg',
      rating: 88,
      time: '55–75 min',
    },
    {
      name: 'KFC',
      image: 'https://i.imgur.com/uu3GKCh.jpeg',
      rating: 88,
      time: '55–75 min',
    },
  ];

  return (
    <div
      data-theme="forest"
      className="flex items-center justify-center min-h-screen w-screen bg-base-200 p-4"
    >
      <div className="w-full max-w-sm bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🍔 Restaurants</h1>
        </div>

        {storeData.map((store, idx) => (
          <StoreCard key={idx} {...store} />
        ))}
      </div>
    </div>
  );
};

export default Stores;
