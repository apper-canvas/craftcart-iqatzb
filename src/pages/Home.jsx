import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Ceramics", image: "https://images.unsplash.com/photo-1565193566173-7a0af771d91b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Textiles", image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Woodwork", image: "https://images.unsplash.com/photo-1605249590301-38950b767c2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" }
  ]);
  
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: 1,
      name: "Handcrafted Ceramic Mug",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Ceramics",
      rating: 4.8
    },
    {
      id: 2,
      name: "Artisan Wooden Bowl",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1603031612576-5a1e2a18b42c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Woodwork",
      rating: 4.6
    },
    {
      id: 3,
      name: "Hand-woven Basket",
      price: 32.50,
      image: "https://images.unsplash.com/photo-1567225591450-06036b3392a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Textiles",
      rating: 4.9
    },
    {
      id: 4,
      name: "Custom Silver Necklace",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Jewelry",
      rating: 5.0
    }
  ]);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const ShoppingBagIcon = getIcon('ShoppingBag');
  const HeartIcon = getIcon('Heart');
  const FilterIcon = getIcon('Filter');
  const StarIcon = getIcon('Star');
  const PlusCircleIcon = getIcon('PlusCircle');
  const XIcon = getIcon('X');
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const CheckCircleIcon = getIcon('CheckCircle');

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast.success(`Added ${product.name} to cart!`, {
      icon: () => <CheckCircleIcon className="text-secondary w-5 h-5" />
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.info("Item removed from cart");
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-6"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance text-surface-900 dark:text-white">
                Handcrafted with <span className="text-primary">Love</span>,<br/>
                Delivered with <span className="text-secondary">Care</span>
              </h1>
              <p className="text-lg text-surface-700 dark:text-surface-300 max-w-xl">
                Discover unique, handmade products created by passionate artisans. 
                Every purchase supports small businesses and brings one-of-a-kind 
                craftsmanship to your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary py-3 px-8 rounded-full shadow-md hover:shadow-lg">
                  Shop Now
                </button>
                <button className="btn-outline py-3 px-8 rounded-full">
                  Our Story
                </button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1"
            >
              <img 
                src="https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Handcrafted Products" 
                className="w-full h-auto object-cover rounded-2xl shadow-soft"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg md:text-xl">{category.name}</h3>
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Feature */}
      <MainFeature />

      {/* Featured Products */}
      <section className="py-14 bg-surface-100/50 dark:bg-surface-800/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-700 rounded-lg shadow-sm hover:shadow">
                <FilterIcon className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              <select className="px-4 py-2 bg-white dark:bg-surface-700 rounded-lg shadow-sm hover:shadow text-sm">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="product-card group relative"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button 
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-surface-800 rounded-full shadow-md hover:bg-surface-100 hover:dark:bg-surface-700 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <HeartIcon className="w-5 h-5 text-surface-500 hover:text-primary" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-primary hover:bg-primary-dark text-white rounded-full py-2 md:py-3 px-5 md:px-6 flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      <span className="font-medium">Add to Cart</span>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center text-sm">
                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="font-bold text-xl text-primary-dark dark:text-primary-light">${product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      <button 
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-20 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg flex items-center justify-center"
      >
        <ShoppingCartIcon className="w-6 h-6" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {getTotalItems()}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {showCart && (
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
                  onClick={() => setShowCart(false)}
                  className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
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
                      onClick={() => setShowCart(false)}
                      className="btn-primary"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b dark:border-surface-700">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-primary-dark dark:text-primary-light font-bold">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center mt-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded bg-surface-100 dark:bg-surface-700"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded bg-surface-100 dark:bg-surface-700"
                            >
                              +
                            </button>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-surface-500 hover:text-red-500"
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
                <div className="p-4 border-t dark:border-surface-700">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <button className="btn-primary w-full py-3">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;