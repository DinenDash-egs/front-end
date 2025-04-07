import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; // reuse your existing one
import DeliveryMap from '../components/DeliveryMap';
import CheckoutForm from '../components/CheckoutForm';

const Products = () => {
  const { storeName } = useParams();
  const [cart, setCart] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoords, setDeliveryCoords] = useState(null);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:8001/v1/auth/user/${username}`, {
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
      [product.name]: {
        ...product,
        quantity: (prev[product.name]?.quantity || 0) + 1,
      },
    }));
  };

  const handleRemove = (product) => {
    setCart((prev) => {
      const qty = prev[product.name]?.quantity || 0;
      if (qty <= 1) {
        const copy = { ...prev };
        delete copy[product.name];
        return copy;
      }
      return {
        ...prev,
        [product.name]: {
          ...product,
          quantity: qty - 1,
        },
      };
    });
  };

  const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSelectLocation = (coords, address) => {
    setDeliveryCoords(coords);
    setDeliveryAddress(address);
    setShowMap(false);
  };

  const handlePay = async () => {
    const orderId = `order_${Date.now()}`;
  
    const res = await fetch('http://localhost:5007/v1/deliveries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        customer_name: userInfo?.username,
        address: deliveryAddress,
        restaurant_address: "KFC Aveiro, R. do Ten. Resende 29",
        delivery_date: new Date().toISOString(),
        estimated_delivery_time: new Date(Date.now() + 3600000).toISOString(),
        status: 'pending',
      }),
    });
  
    if (!res.ok) return alert('Failed to create delivery.');
  
    const data = await res.json();
    alert(`✅ Delivery created! Tracking ID: ${data.tracking_id}`);
    setCart({});
    setDeliveryAddress('');
    setDeliveryCoords(null);
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

  return (
    <div className="min-h-screen bg-base-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-sm bg-base-100 rounded-2xl shadow-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">🍔 {storeName} Menu</h2>

        {[
          { name: 'Spicy Chicken Wings', price: 4.49, image: 'https://i.imgur.com/e6WFhk9.png' },
          { name: 'Fries Combo', price: 3.25, image: 'https://i.imgur.com/e6WFhk9.png' },
        ].map((product) => (
          <ProductCard
            key={product.name}
            {...product}
            quantity={cart[product.name]?.quantity || 0}
            onAdd={() => handleAdd(product)}
            onRemove={() => handleRemove(product)}
          />
        ))}

        {Object.keys(cart).length > 0 && (
          <button className="btn btn-primary w-full rounded-full" onClick={() => setShowMap(true)}>
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default Products;
