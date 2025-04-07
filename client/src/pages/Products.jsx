import { useParams } from 'react-router-dom';
import { useState } from 'react';

const productData = [
  {
    name: 'Zinger Burger',
    price: 5.99,
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Spicy Chicken Wings',
    price: 4.49,
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Fries Combo',
    price: 3.25,
    image: 'https://via.placeholder.com/150',
  },
];

const ProductCard = ({ name, price, image, quantity, onAdd, onRemove }) => (
  <div className="bg-base-100 rounded-xl shadow-md overflow-hidden flex items-center space-x-4 p-4">
    <img src={image} alt={name} className="w-16 h-16 rounded-md object-cover" />
    <div className="flex-1">
      <h3 className="text-md font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">€{price.toFixed(2)}</p>
    </div>

    {quantity > 0 ? (
      <div className="flex items-center space-x-2">
        <button className="btn btn-sm btn-outline btn-circle" onClick={onRemove}>-</button>
        <span className="font-semibold">{quantity}</span>
        <button className="btn btn-sm btn-outline btn-circle" onClick={onAdd}>+</button>
      </div>
    ) : (
      <button className="btn btn-sm btn-primary rounded-full" onClick={onAdd}>+</button>
    )}
  </div>
);

const Products = () => {
  const { storeName } = useParams();
  const [cart, setCart] = useState({});
  const [showModal, setShowModal] = useState(false);

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
      const currentQty = prev[product.name]?.quantity || 0;
      if (currentQty <= 1) {
        const newCart = { ...prev };
        delete newCart[product.name];
        return newCart;
      }
      return {
        ...prev,
        [product.name]: {
          ...product,
          quantity: currentQty - 1,
        },
      };
    });
  };

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handlePay = () => {
    setShowModal(false);
    alert(`✅ Payment of €${totalPrice.toFixed(2)} successful!`);
    setCart({});
  };

  return (
    <div data-theme="forest" className="relative flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="w-full max-w-sm bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-center capitalize">
          🛍️ {storeName} Menu
        </h1>

        <div className="space-y-4">
          {productData.map((product) => (
            <ProductCard
              key={product.name}
              {...product}
              quantity={cart[product.name]?.quantity || 0}
              onAdd={() => handleAdd(product)}
              onRemove={() => handleRemove(product)}
            />
          ))}
        </div>
      </div>

      {/* 🛒 Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <button
            className="btn btn-primary rounded-full shadow-lg px-6 text-white flex gap-3 items-center"
            onClick={() => setShowModal(true)}
          >
            🛒 {totalItems} item{totalItems > 1 ? 's' : ''} • €{totalPrice.toFixed(2)} — Checkout
          </button>
        </div>
      )}

      {/* 💳 Modal */}
      {showModal && (
        <>
          <input type="checkbox" id="cart-modal" className="modal-toggle" checked readOnly />
          <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box space-y-4">
              <h3 className="font-bold text-lg">🛒 Cart Summary</h3>
              <ul className="space-y-2">
                {Object.values(cart).map((item) => (
                  <li key={item.name} className="flex justify-between">
                    <span>{item.quantity} × {item.name}</span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="font-bold text-right text-lg mt-4">
                Total: €{totalPrice.toFixed(2)}
              </div>
              <div className="modal-action">
                <button className="btn btn-outline rounded-full" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary rounded-full" onClick={handlePay}>
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
