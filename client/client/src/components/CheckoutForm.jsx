import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const CheckoutForm = ({ cart, totalPrice, userInfo, deliveryAddress, onPay, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = 2.99;
  const finalTotal = totalPrice + deliveryFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPay();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowBackIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Order Summary</h2>
                <p className="text-orange-100">{totalItems} items in your cart</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3 mb-4">
              {Object.values(cart).map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-800">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>€{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-600">€{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RestaurantIcon className="w-5 h-5 text-orange-500" />
            Delivery Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <PersonIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold text-gray-800 capitalize">{userInfo?.username || 'Guest'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <LocationOnIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="font-semibold text-gray-800">{deliveryAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PaymentIcon className="w-5 h-5 text-orange-500" />
            Payment Method
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                paymentMethod === 'card' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCardIcon className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-orange-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`font-semibold ${paymentMethod === 'card' ? 'text-orange-700' : 'text-gray-700'}`}>
                    Credit/Debit Card
                  </p>
                  <p className="text-sm text-gray-500">Pay securely with your card</p>
                </div>
                {paymentMethod === 'card' && (
                  <div className="ml-auto w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                paymentMethod === 'cash' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <AccountBalanceWalletIcon className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-orange-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`font-semibold ${paymentMethod === 'cash' ? 'text-orange-700' : 'text-gray-700'}`}>
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
                {paymentMethod === 'cash' && (
                  <div className="ml-auto w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="pb-6">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full px-6 py-4 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Place Order • €${finalTotal.toFixed(2)}`
            )}
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-3">
            By placing this order, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;