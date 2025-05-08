import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { closeCart, removeFromCart, updateQuantity } from '../store/cartSlice';
import getIcon from '../utils/iconUtils';

function CartDrawer() {
  const dispatch = useDispatch();
  const { items: cart, showCart } = useSelector(state => state.cart);
  
  const XIcon = getIcon('X');
  const ShoppingBagIcon = getIcon('ShoppingBag');
  const navigate = useNavigate();
  
  const handleClose = () => {
    dispatch(closeCart());
  };
  
  const handleUpdateQuantity = (id, quantity) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };
  
  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item.id));
    toast.info(`Removed ${item.name} from cart`);
  };
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
    toast.info('Proceeding to checkout');
  };
  
  if (!showCart) return null;
  
  return (
    <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="absolute top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-surface-800 shadow-lg"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-surface-700">
            <h2 className="font-bold text-xl">Your Cart</h2>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              aria-label="Close cart"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBagIcon className="w-16 h-16 text-surface-400 mb-4" />
                <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
                <p className="text-surface-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <button 
                  onClick={handleClose}
                  className="btn-primary"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium text-lg mb-4">Items in your cart ({cart.length})</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 p-2 rounded-lg transition-colors">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-primary-dark dark:text-primary-light font-bold">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-surface-500 text-sm">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      </p>
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded bg-surface-100 dark:bg-surface-700"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded bg-surface-100 dark:bg-surface-700"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => handleRemoveItem(item)}
                          className="ml-auto text-surface-500 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="p-4 border-t dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-surface-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between mb-4 font-bold text-lg">
                <span>Estimated Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="btn-primary w-full py-3 flex items-center justify-center space-x-2">
                <span>Proceed to Checkout</span>
              </button>
              <button 
                onClick={() => {
                  dispatch(closeCart());
                  navigate('/cart');
                }}
                className="btn-outline w-full py-3 mt-2 flex items-center justify-center space-x-2">
                <span>View Cart</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default CartDrawer;