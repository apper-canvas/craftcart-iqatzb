import { useDispatch, useSelector } from 'react-redux';
import { openCart } from '../store/cartSlice';
import getIcon from '../utils/iconUtils';

function CartButton() {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);
  const ShoppingCartIcon = getIcon('ShoppingCart');
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  return (
    <button 
      onClick={() => dispatch(openCart())}
      className="fixed bottom-6 right-6 z-20 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg flex items-center justify-center"
      aria-label="Open cart"
    >
      <ShoppingCartIcon className="w-6 h-6" />
      {getTotalItems() > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {getTotalItems()}
        </span>
      )}
    </button>
  );
}

export default CartButton;