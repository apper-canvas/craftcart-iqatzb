import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearCart } from '../store/cartSlice';
import getIcon from '../utils/iconUtils';

function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState({
    customer: {
      email: '',
      isGuest: true,
    },
    shipping: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
    },
    payment: {
      cardNumber: '',
      nameOnCard: '',
      expiry: '',
      cvv: '',
    }
  });
  
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ChevronRightIcon = getIcon('ChevronRight');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const CheckIcon = getIcon('Check');
  const UserIcon = getIcon('User');
  const TruckIcon = getIcon('Truck');
  const CreditCardIcon = getIcon('CreditCard');
  const ShoppingBagIcon = getIcon('ShoppingBag');

  const steps = [
    { name: 'Cart Review', icon: ShoppingBagIcon },
    { name: 'Account', icon: UserIcon },
    { name: 'Shipping', icon: TruckIcon },
    { name: 'Payment', icon: CreditCardIcon },
    { name: 'Review', icon: CheckIcon }
  ];

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (section, field, value) => {
    setCheckoutData({
      ...checkoutData,
      [section]: {
        ...checkoutData[section],
        [field]: value
      }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmitOrder = () => {
    // Here you would typically send the order to your backend
    toast.success('Your order has been placed successfully!');
    dispatch(clearCart());
    navigate('/order-confirmation');
  };

  // Render cart review step
  const renderCartReview = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Review Your Cart</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBagIcon className="w-16 h-16 mx-auto text-surface-400 mb-4" />
          <p className="text-lg">Your cart is empty</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary mt-4"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg dark:border-surface-700">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-surface-500 text-sm">Quantity: {item.quantity}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-primary-dark dark:text-primary-light font-bold">
                      ${item.price.toFixed(2)} each
                    </p>
                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-surface-700">
              <span>Total</span>
              <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Render account step
  const renderAccountStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Account Information</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            value={checkoutData.customer.email}
            onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
            className="input-field"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="flex items-center gap-4 p-4 border rounded-lg dark:border-surface-700">
          <input
            type="checkbox"
            id="guestCheckout"
            checked={checkoutData.customer.isGuest}
            onChange={(e) => handleInputChange('customer', 'isGuest', e.target.checked)}
            className="h-4 w-4 text-primary"
          />
          <label htmlFor="guestCheckout">Continue as guest</label>
        </div>
        
        {!checkoutData.customer.isGuest && (
          <div className="border p-4 rounded-lg dark:border-surface-700">
            <p className="mb-4">Login or create an account functionality would go here</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render steps buttons
  const renderStepButtons = () => (
    <div className="flex justify-between mt-8">
      {currentStep > 0 && (
        <button 
          onClick={prevStep}
          className="btn-outline flex items-center gap-2"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back
        </button>
      )}
      <div className="flex-1"></div>
      {currentStep < steps.length - 1 && cart.length > 0 ? (
        <button 
          onClick={nextStep}
          className="btn-primary flex items-center gap-2"
        >
          Next
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      ) : currentStep === steps.length - 1 && cart.length > 0 ? (
        <button 
          onClick={handleSubmitOrder}
          className="btn-primary flex items-center gap-2"
        >
          Place Order
          <CheckIcon className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      {/* Checkout Steps Indicator */}
      <div className="flex mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-primary' : 'text-surface-400'
              }`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index < currentStep 
                    ? 'bg-primary border-primary text-white' 
                    : index === currentStep
                      ? 'border-primary text-primary' 
                      : 'border-surface-300 dark:border-surface-600'
                }`}
              >
                {index < currentStep ? <CheckIcon className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className="text-xs mt-1 whitespace-nowrap">{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`w-10 h-0.5 sm:w-16 md:w-24 ${
                  index < currentStep ? 'bg-primary' : 'bg-surface-300 dark:bg-surface-600'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Current Step Content */}
      <div className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-card">
        {currentStep === 0 && renderCartReview()}
        {currentStep === 1 && renderAccountStep()}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  value={checkoutData.shipping.firstName}
                  onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                  className="input-field"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  value={checkoutData.shipping.lastName}
                  onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                  className="input-field"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address*</label>
              <input
                type="text"
                id="address"
                value={checkoutData.shipping.address}
                onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                className="input-field"
                placeholder="123 Main St, Apt 4B"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City*</label>
                <input
                  type="text"
                  id="city"
                  value={checkoutData.shipping.city}
                  onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                  className="input-field"
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-1">State/Province*</label>
                <input
                  type="text"
                  id="state"
                  value={checkoutData.shipping.state}
                  onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                  className="input-field"
                  placeholder="NY"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium mb-1">Postal Code*</label>
                <input
                  type="text"
                  id="postalCode"
                  value={checkoutData.shipping.postalCode}
                  onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                  className="input-field"
                  placeholder="10001"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Country*</label>
              <select
                id="country"
                value={checkoutData.shipping.country}
                onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
                className="input-field"
                required
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
              </select>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            {/* Payment form fields would go here */}
            <p className="text-surface-500">Payment form would be implemented here</p>
          </div>
        )}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Review Your Order</h2>
            <p className="mb-4">Please review your order details before finalizing.</p>
            {/* Order summary and final review would go here */}
            <p className="text-surface-500">Order summary and final confirmation would be displayed here</p>
          </div>
        )}
        
        {renderStepButtons()}
      </div>
    </div>
  );
}

export default CheckoutPage;