import { useState } from 'react';

const CheckoutForm = ({ cart, totalPrice, userInfo, deliveryAddress, onPay, onBack }) => {
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-base-200">
      <div className="w-full max-w-sm bg-base-100 rounded-2xl shadow-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">🧾 Order Summary</h2>

        <ul className="text-sm divide-y">
          {Object.values(cart).map((item) => (
            <li key={item.name} className="flex justify-between py-2">
              <span>{item.quantity}× {item.name}</span>
              <span>€{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div>
          <label className="label-text">Customer</label>
          <input className="input input-bordered w-full rounded-full" value={userInfo?.username || ''} readOnly />
        </div>

        <div>
          <label className="label-text">Delivery Address</label>
          <input className="input input-bordered w-full rounded-full" value={deliveryAddress} readOnly />
        </div>

        <div className="text-right font-bold mt-2">Total: €{totalPrice.toFixed(2)}</div>

        <div className="flex justify-between pt-4">
          <button className="btn btn-outline rounded-full" onClick={onBack}>Back</button>
          <button className="btn btn-primary rounded-full" onClick={onPay}>Pay Now</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
