import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';

const StoreCard = ({ image, name, rating, time, cuisine, priceRange }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
         onClick={() => navigate(`/store/${name.toLowerCase()}`)}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-24 pointer-events-none" />
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>
            <p className="text-sm text-gray-500">{cuisine} • {priceRange}</p>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
            <StarIcon className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-gray-700">{rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <AccessTimeIcon className="w-4 h-4" />
            <span className="text-sm">{time}</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-full hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryFilter = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg scale-105' 
          : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 shadow-md'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const Stores = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All', icon: RestaurantIcon },
    { id: 'burger', label: 'Burgers', icon: LunchDiningIcon },
    { id: 'pizza', label: 'Pizza', icon: LocalPizzaIcon },
    { id: 'asian', label: 'Asian', icon: RamenDiningIcon },
    { id: 'fast', label: 'Fast Food', icon: FastfoodIcon },
  ];

  const storeData = [
    {
      name: 'KFC Aveiro',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&h=300&fit=crop',
      rating: 4.8,
      time: '25-35 min',
      cuisine: 'American',
      priceRange: '$$',
      category: 'fast',
      address: 'Forum Aveiro, R. Batalhão Caçadores 10, 3810-064 Aveiro'
    },
    {
      name: "McDonald's Aveiro",
      image: 'https://images.unsplash.com/photo-1619454016518-697bc231e7cb?w=500&h=300&fit=crop',
      rating: 4.2,
      time: '20-30 min',
      cuisine: 'American',
      priceRange: '$$',
      category: 'fast',
      address: 'Av. Dr. Lourenço Peixinho 146, 3800-163 Aveiro'
    },
    {
      name: 'Pizza Hut Aveiro',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop',
      rating: 4.5,
      time: '30-40 min',
      cuisine: 'Italian',
      priceRange: '$$',
      category: 'pizza',
      address: 'Centro Comercial Glicínias Plaza, 3810-498 Aveiro'
    }
  ];

  const filteredStores = storeData.filter(store => {
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dine&Dash</h1>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-800 placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Browse by Category</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <CategoryFilter
                key={category.id}
                icon={category.icon}
                label={category.label}
                active={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedCategory === 'all' ? 'All Restaurants' : `${categories.find(c => c.id === selectedCategory)?.label} Restaurants`}
          </h3>
          <span className="text-sm text-gray-500">{filteredStores.length} restaurants</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store, idx) => (
            <StoreCard key={idx} {...store} />
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-16">
            <FastfoodIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No restaurants found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stores;