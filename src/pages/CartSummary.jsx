import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import getIcon from '../utils/iconUtils';

function CartSummary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cart } = useSelector(state => state.cart);
  
  const TrashIcon = getIcon('Trash2');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const ShoppingBagIcon = getIcon('ShoppingBag');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ id, quantity }));
      toast.success('Cart updated');
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item.id));
    toast.info(`Removed ${item.name} from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.info('Cart has been cleared');
    }
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getEstimatedTax = () => {
    return getSubtotal() * 0.08; // Assuming 8% tax rate
  };

  const getShippingCost = () => {
    return getSubtotal() > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const getTotal = () => {
    return getSubtotal() + getEstimatedTax() + getShippingCost();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-surface-800 rounded-xl shadow-card p-8 text-center">
            <ShoppingBagIcon className="w-20 h-20 mx-auto text-surface-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-surface-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="btn-primary px-6 py-3"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Your Cart</h1>
          
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="ml-auto flex items-center text-red-500 hover:text-red-600"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">Clear Cart</span>
            </button>
          )}
        </div>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden mb-8 lg:mb-0">
              <div className="p-6">
                <div className="hidden sm:grid sm:grid-cols-12 text-sm font-medium text-surface-500 mb-4 px-4">
                  <div className="sm:col-span-6">Product</div>
                  <div className="sm:col-span-2 text-center">Price</div>
                  <div className="sm:col-span-2 text-center">Quantity</div>
                  <div className="sm:col-span-2 text-right">Total</div>
                </div>
                
                <div className="divide-y dark:divide-surface-700">
                  {cart.map(item => (
                    <div key={item.id} className="py-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                      <div className="sm:col-span-6 flex items-center">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden mr-4">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-surface-500 mt-1">{item.category}</p>
                          <button 
                            onClick={() => handleRemoveItem(item)}
                            className="text-sm text-red-500 hover:text-red-600 mt-2 sm:hidden"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2 text-center mt-4 sm:mt-0">
                        <p className="sm:hidden text-sm text-surface-500 mb-1">Price:</p>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="sm:col-span-2 flex justify-center mt-4 sm:mt-0">
                        <p className="sm:hidden text-sm text-surface-500 mb-1 mr-2">Quantity:</p>
                        <div className="flex items-center border dark:border-surface-600 rounded-lg">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2 text-right mt-4 sm:mt-0 flex justify-between sm:block">
                        <p className="sm:hidden text-sm text-surface-500">Total:</p>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <button 
                          onClick={() => handleRemoveItem(item)}
                          className="hidden sm:inline-block text-sm text-red-500 hover:text-red-600 ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden p-6">
              <h2 className="font-bold text-xl mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
                  <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Estimated Tax</span>
                  <span className="font-medium">${getEstimatedTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Shipping</span>
                  {getShippingCost() === 0 ? (
                    <span className="font-medium text-secondary">Free</span>
                  ) : (
                    <span className="font-medium">${getShippingCost().toFixed(2)}</span>
                  )}
                </div>
                <div className="border-t dark:border-surface-700 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${getTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-3 font-medium"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={() => navigate('/')}
                className="btn-outline w-full py-3 mt-2 font-medium"
              >
                Continue Shopping
              </button>
              
              <div className="mt-6 text-xs text-surface-500 text-center">
                <p>Taxes and shipping calculated at checkout</p>
                <p className="mt-2">We accept all major credit cards, PayPal, and Apple Pay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;