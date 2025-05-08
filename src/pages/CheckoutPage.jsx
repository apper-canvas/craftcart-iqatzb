import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearCart } from '../store/cartSlice';
import getIcon from '../utils/iconUtils';

function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState({
    customer: {
      email: '',
      isGuest: true,
      password: '',
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
      method: 'credit',
      nameOnCard: '',
      expiry: '',
      cvv: '',
      savePaymentInfo: false
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cardNumberError, setCardNumberError] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [expiryError, setExpiryError] = useState('');
  
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ChevronRightIcon = getIcon('ChevronRight');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const CheckIcon = getIcon('Check');
  const UserIcon = getIcon('User');
  const TruckIcon = getIcon('Truck');
  const CreditCardIcon = getIcon('CreditCard');
  const ShoppingBagIcon = getIcon('ShoppingBag');
  const LockIcon = getIcon('Lock');
  const AlertCircleIcon = getIcon('AlertCircle');
  const CreditCard = getIcon('CreditCard');

  const steps = [
    { name: 'Cart Review', icon: ShoppingBagIcon },
    { name: 'Account', icon: UserIcon },
    { name: 'Shipping', icon: TruckIcon },
    { name: 'Payment', icon: CreditCardIcon },
    { name: 'Review', icon: CheckIcon }
  ];

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

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

  const validateCardNumber = (number) => {
    const cardNumber = number.replace(/\s/g, '');
    const regex = /^[0-9]{16}$/;
    
    if (!regex.test(cardNumber)) {
      setCardNumberError('Please enter a valid 16-digit card number');
      return false;
    }
    
    setCardNumberError('');
    return true;
  };

  const validateCVV = (cvv) => {
    const regex = /^[0-9]{3,4}$/;
    
    if (!regex.test(cvv)) {
      setCvvError('CVV must be 3 or 4 digits');
      return false;
    }
    
    setCvvError('');
    return true;
  };

  const validateExpiry = (expiry) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    
    if (!regex.test(expiry)) {
      setExpiryError('Use MM/YY format');
      return false;
    }
    
    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    
    if (expiryDate < today) {
      setExpiryError('Card has expired');
      return false;
    }
    
    setExpiryError('');
    return true;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    handleInputChange('payment', 'cardNumber', formatCardNumber(value));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    
    handleInputChange('payment', 'expiry', value);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Validate payment information if moving from payment step
      if (currentStep === 3 && !validatePaymentInfo()) return;
      
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const validatePaymentInfo = () => {
    if (checkoutData.payment.method === 'credit') {
      const isCardValid = validateCardNumber(checkoutData.payment.cardNumber);
      const isCvvValid = validateCVV(checkoutData.payment.cvv);
      const isExpiryValid = validateExpiry(checkoutData.payment.expiry);
      
      return isCardValid && isCvvValid && isExpiryValid && checkoutData.payment.nameOnCard;
    }
    
    return true; // For PayPal or other methods
  };

  const simulatePaymentProcessing = () => {
    setIsProcessing(true);
    
    // Simulate payment processing with a delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      toast.success('Payment processed successfully!');
      handleSubmitOrder();
    }, 2000);
  };

  const handleSubmitOrder = () => {
    if (currentStep === 4) {
      if (!paymentComplete) {
        simulatePaymentProcessing();
      } else {
        // If payment is already complete, finalize order
        toast.success('Your order has been placed successfully!');
        dispatch(clearCart());
        navigate('/order-confirmation');
      }
    }
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
            <h3 className="text-lg font-medium mb-4">Login or Create an Account</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  value={checkoutData.customer.password}
                  onChange={(e) => handleInputChange('customer', 'password', e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  onClick={() => {
                    if (checkoutData.customer.email && checkoutData.customer.password) {
                      toast.success('Successfully logged in!');
                    } else {
                      toast.error('Please enter both email and password');
                    }
                  }}
                >
                  Login
                </button>
                <button 
                  type="button" 
                  className="btn-outline flex-1"
                  onClick={() => {
                    toast.info('Account creation would happen here');
                  }}
                >
                  Create Account
                </button>
              </div>
            </div>
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
          {isProcessing ? (
            <span>Processing...</span>
          ) : paymentComplete ? (
            <span>Complete Order</span>
          ) : (
            <span>Process Payment & Place Order</span>
          )}
        </button>
      ) : cart.length === 0 ? (
        <button onClick={() => navigate('/')} className="btn-primary">
          Start Shopping
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
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            
            <div className="flex justify-between items-center p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <div className="flex items-center">
                <LockIcon className="w-5 h-5 text-secondary mr-2" />
                <span className="text-sm">Secure Payment Processing</span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-surface-200 dark:bg-surface-700 rounded">SSL</span>
                <span className="text-xs px-2 py-1 bg-surface-200 dark:bg-surface-700 rounded">PCI DSS</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    checkoutData.payment.method === 'credit' 
                      ? 'border-primary bg-primary bg-opacity-5' 
                      : 'dark:border-surface-700'
                  }`}
                  onClick={() => handleInputChange('payment', 'method', 'credit')}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="creditCard" 
                      checked={checkoutData.payment.method === 'credit'} 
                      onChange={() => {}} 
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="creditCard" className="font-medium">Credit Card</label>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" alt="Visa" className="h-6" />
                    <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" alt="Mastercard" className="h-6" />
                    <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" alt="Amex" className="h-6" />
                  </div>
                </div>
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    checkoutData.payment.method === 'paypal' 
                      ? 'border-primary bg-primary bg-opacity-5' 
                      : 'dark:border-surface-700'
                  }`}
                  onClick={() => handleInputChange('payment', 'method', 'paypal')}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="paypal" 
                      checked={checkoutData.payment.method === 'paypal'} 
                      onChange={() => {}} 
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="paypal" className="font-medium">PayPal</label>
                  </div>
                  <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" alt="PayPal" className="h-8 mt-2" />
                </div>
              </div>
              
              {checkoutData.payment.method === 'credit' && (
                <div className="space-y-4 p-4 border rounded-lg dark:border-surface-700">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number*</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        value={checkoutData.payment.cardNumber}
                        onChange={handleCardNumberChange}
                        onBlur={() => validateCardNumber(checkoutData.payment.cardNumber)}
                        className={`input-field pl-10 ${cardNumberError ? 'border-red-500' : ''}`}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                    </div>
                    {cardNumberError && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircleIcon className="w-3 h-3 mr-1" />{cardNumberError}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="nameOnCard" className="block text-sm font-medium mb-1">Name on Card*</label>
                    <input
                      type="text"
                      id="nameOnCard"
                      value={checkoutData.payment.nameOnCard}
                      onChange={(e) => handleInputChange('payment', 'nameOnCard', e.target.value)}
                      className="input-field"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium mb-1">Expiry Date (MM/YY)*</label>
                      <input
                        type="text"
                        id="expiry"
                        value={checkoutData.payment.expiry}
                        onChange={handleExpiryChange}
                        onBlur={() => validateExpiry(checkoutData.payment.expiry)}
                        className={`input-field ${expiryError ? 'border-red-500' : ''}`}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                      {expiryError && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircleIcon className="w-3 h-3 mr-1" />{expiryError}</p>}
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV*</label>
                      <div className="relative">
                        <input
                          type="text"
                          id="cvv"
                          value={checkoutData.payment.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              handleInputChange('payment', 'cvv', value);
                            }
                          }}
                          onBlur={() => validateCVV(checkoutData.payment.cvv)}
                          className={`input-field ${cvvError ? 'border-red-500' : ''}`}
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-surface-400 cursor-help" title="3 or 4 digit security code on the back of your card">?</span>
                      </div>
                      {cvvError && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircleIcon className="w-3 h-3 mr-1" />{cvvError}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="savePaymentInfo"
                      checked={checkoutData.payment.savePaymentInfo}
                      onChange={(e) => handleInputChange('payment', 'savePaymentInfo', e.target.checked)}
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="savePaymentInfo" className="text-sm">Save my payment information for future purchases</label>
                  </div>
                </div>
              )}
              
              {checkoutData.payment.method === 'paypal' && (
                <div className="p-6 border rounded-lg text-center dark:border-surface-700">
                  <p className="mb-4">You'll be redirected to PayPal to complete your payment.</p>
                  <button
                    type="button"
                    className="btn-primary w-full max-w-xs mx-auto"
                    onClick={() => {
                      toast.info('Redirecting to PayPal...');
                      setTimeout(() => {
                        setPaymentComplete(true);
                        nextStep();
                        toast.success('PayPal payment completed successfully!');
                      }, 1500);
                    }}
                  >
                    Continue to PayPal
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Total Payment</span>
                <span className="font-bold">${(getCartTotal() * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden dark:border-surface-700">
                <div className="bg-surface-100 dark:bg-surface-700 px-4 py-2 font-medium">
                  Order Items
                </div>
                <div className="p-4 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-surface-500 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg overflow-hidden dark:border-surface-700">
                  <div className="bg-surface-100 dark:bg-surface-700 px-4 py-2 font-medium">
                    Shipping Information
                  </div>
                  <div className="p-4">
                    <p className="font-medium">{checkoutData.shipping.firstName} {checkoutData.shipping.lastName}</p>
                    <p>{checkoutData.shipping.address}</p>
                    <p>{checkoutData.shipping.city}, {checkoutData.shipping.state} {checkoutData.shipping.postalCode}</p>
                    <p>{checkoutData.shipping.country}</p>
                    <p className="mt-2">{checkoutData.customer.email}</p>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden dark:border-surface-700">
                  <div className="bg-surface-100 dark:bg-surface-700 px-4 py-2 font-medium">
                    Payment Method
                  </div>
                  <div className="p-4">
                    {checkoutData.payment.method === 'credit' ? (
                      <div>
                        <p className="font-medium">Credit Card</p>
                        <p>Card ending in {checkoutData.payment.cardNumber.slice(-4)}</p>
                        <p>Expires: {checkoutData.payment.expiry}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p>{checkoutData.customer.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden dark:border-surface-700">
                <div className="bg-surface-100 dark:bg-surface-700 px-4 py-2 font-medium">
                  Order Summary
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax (10%)</span>
                    <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-surface-700">
                    <span>Total</span>
                    <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {isProcessing && (
              <div className="mt-6 p-4 bg-primary bg-opacity-10 rounded-lg text-center">
                <div className="animate-pulse flex justify-center items-center">
                  <LockIcon className="w-5 h-5 mr-2 text-primary" />
                  <span>Processing your payment...</span>
                </div>
              </div>
            )}
            {paymentComplete && !isProcessing && (
              <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 rounded-lg text-center">
                <div className="flex justify-center items-center text-green-600 dark:text-green-400">
                  <CheckIcon className="w-5 h-5 mr-2" />
                  <span>Payment completed successfully!</span>
                </div>
                <p className="text-sm mt-2 text-surface-600 dark:text-surface-400">Your order will be processed shortly.</p>
              </div>
            )}
          </div>
        )}
        
        {renderStepButtons()}
      </div>
    </div>
  );
}

export default CheckoutPage;