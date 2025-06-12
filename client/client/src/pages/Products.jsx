import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import DeliveryMap from '../components/DeliveryMap';
import CheckoutForm from '../components/CheckoutForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';

const Products = () => {
  const { storeName } = useParams();
  const navigate = useNavigate();

  const [cart, setCart] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  // Mock restaurant data - you can replace with API data
  const restaurantInfo = {
    name: storeName,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=1200&h=400&fit=crop',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minOrder: 10,
    categories: ['Chicken', 'Burgers', 'Sides', 'Desserts', 'Drinks']
  };

  // Mock products data - you can replace with API data
  const products = [
    { 
      id: 1,
      name: 'Spicy Chicken Wings', 
      price: 8.99, 
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
      description: '6 pieces of crispy wings with spicy coating',
      category: 'Chicken'
    },
    { 
      id: 2,
      name: 'Original Recipe Chicken', 
      price: 12.49, 
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop',
      description: '3 pieces of our famous original recipe',
      category: 'Chicken'
    },
    { 
      id: 3,
      name: 'Zinger Burger', 
      price: 6.99, 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      description: 'Spicy chicken fillet burger with lettuce',
      category: 'Burgers'
    },
    { 
      id: 4,
      name: 'Double Krunch Burger', 
      price: 9.99, 
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      description: 'Double chicken patty with cheese and special sauce',
      category: 'Burgers'
    },
    { 
      id: 5,
      name: 'French Fries', 
      price: 3.49, 
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
      description: 'Crispy golden fries',
      category: 'Sides'
    },
    { 
      id: 6,
      name: 'Coleslaw', 
      price: 2.99, 
      image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&h=300&fit=crop',
      description: 'Fresh cabbage salad',
      category: 'Sides'
    },
    { 
      id: 7,
      name: 'Ice Cream Sundae', 
      price: 4.49, 
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
      description: 'Vanilla ice cream with chocolate sauce',
      category: 'Desserts'
    },
    { 
      id: 8,
      name: 'Coca-Cola', 
      price: 2.49, 
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',
      description: 'Regular 330ml',
      category: 'Drinks'
    }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${import.meta.env.VITE_AUTH_API}/auth/v1/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUserInfo(data);
    };

    if (username && token) fetchUser();
  }, [username, token]);

  const handleAdd = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const handleRemove = (product) => {
    setCart((prev) => {
      const qty = prev[product.id]?.quantity || 0;
      if (qty <= 1) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }
      return {
        ...prev,
        [product.id]: {
          ...product,
          quantity: qty - 1,
        },
      };
    });
  };

  const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectLocation = (coords, address) => {
    setDeliveryCoords(coords);
    setDeliveryAddress(address);
    setShowMap(false);
  };

  const handlePay = async () => {
    const orderId = `order_${Date.now()}`;

    const res = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/deliveries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        customer_name: userInfo?.username,
        address: deliveryAddress,
        restaurant_address: `${storeName} Aveiro, R. do Ten. Resende 29`,
        delivery_date: new Date().toISOString(),
        estimated_delivery_time: new Date(Date.now() + 3600000).toISOString(),
        status: 'pending',
      }),
    });

    if (!res.ok) return alert('Failed to create delivery.');

    const data = await res.json();
    setCart({});
    setDeliveryAddress('');
    setDeliveryCoords(null);

    navigate('/order-lounge');
  };

  if (showMap) {
    return <DeliveryMap onSelectLocation={handleSelectLocation} />;
  }

  if (deliveryAddress) {
    return (
      <CheckoutForm
        cart={cart}
        totalPrice={totalPrice}
        userInfo={userInfo}
        deliveryAddress={deliveryAddress}
        onPay={handlePay}
        onBack={() => setShowMap(true)}
      />
    );
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/stores')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowBackIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{restaurantInfo.name}</h1>
          </div>
        </div>
      </div>

      {/* Restaurant Info Banner */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurantInfo.image} 
          alt={restaurantInfo.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">{restaurantInfo.name}</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-orange-400" />
                <span>{restaurantInfo.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <AccessTimeIcon className="w-4 h-4" />
                <span>{restaurantInfo.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <LocationOnIcon className="w-4 h-4" />
                <span>€{restaurantInfo.deliveryFee} delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-orange-50'
            }`}
          >
            All Items
          </button>
          {restaurantInfo.categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              quantity={cart[product.id]?.quantity || 0}
              onAdd={() => handleAdd(product)}
              onRemove={() => handleRemove(product)}
            />
          ))}
        </div>
      </div>

      {/* Sticky Checkout Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-100 shadow-lg">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'} in cart</p>
                <p className="text-xl font-bold text-gray-800">€{totalPrice.toFixed(2)}</p>
              </div>
              <button 
                className="px-8 py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={() => setShowMap(true)}
              >
                <span>Checkout</span>
                <ArrowBackIcon className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;