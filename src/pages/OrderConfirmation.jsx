import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

function OrderConfirmation() {
  const CheckCircleIcon = getIcon('CheckCircle');
  const ArrowRightIcon = getIcon('ArrowRight');
  
  // Normally this would come from a successful order API response
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString();
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white dark:bg-surface-800 p-8 rounded-xl shadow-card text-center">
        <CheckCircleIcon className="w-16 h-16 mx-auto text-secondary mb-4" />
        
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
          <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg">
            <p className="text-sm text-surface-500 mb-1">Order Number</p>
            <p className="font-bold">{orderNumber}</p>
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg">
            <p className="text-sm text-surface-500 mb-1">Order Date</p>
            <p className="font-bold">{orderDate}</p>
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg">
            <p className="text-sm text-surface-500 mb-1">Estimated Delivery</p>
            <p className="font-bold">3-5 Business Days</p>
          </div>
        </div>
        
        <p className="mb-6">
          A confirmation email has been sent to your email address.
        </p>
        
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          Continue Shopping
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;