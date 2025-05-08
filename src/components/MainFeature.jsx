import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icons
  const SearchIcon = getIcon('Search');
  const ShoppingBasketIcon = getIcon('ShoppingBasket');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const SlidersIcon = getIcon('Sliders');
  const FilterIcon = getIcon('Filter');
  const RefreshCwIcon = getIcon('RefreshCw');

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    price: 'all',
    rating: 'all',
    inStock: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: "Handcrafted Ceramic Mug",
          description: "Beautifully designed ceramic mug, perfect for your morning coffee or tea.",
          price: 24.99,
          image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          category: "Ceramics",
          rating: 4.8,
          inStock: true
        },
        {
          id: 2,
          name: "Artisan Wooden Bowl",
          description: "Hand-carved wooden bowl made from sustainable oak.",
          price: 39.99,
          image: "https://images.unsplash.com/photo-1603031612576-5a1e2a18b42c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          category: "Woodwork",
          rating: 4.6,
          inStock: true
        },
        {
          id: 3,
          name: "Hand-woven Basket",
          description: "Durable hand-woven basket perfect for storage or decoration.",
          price: 32.50,
          image: "https://images.unsplash.com/photo-1567225591450-06036b3392a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          category: "Textiles",
          rating: 4.9,
          inStock: false
        },
        {
          id: 4,
          name: "Custom Silver Necklace",
          description: "Elegant silver necklace with customizable pendant options.",
          price: 54.99,
          image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          category: "Jewelry",
          rating: 5.0,
          inStock: true
        },
        {
          id: 5,
          name: "Macramé Wall Hanging",
          description: "Bohemian-inspired macramé wall hanging to add texture to any room.",
          price: 47.50,
          image: "https://images.unsplash.com/photo-1622993851016-9b53febbda6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          category: "Textiles",
          rating: 4.7,
          inStock: true
        },
        {
          id: 6,
          name: "Handmade Scented Candles",
          description: "Set of 3 scented soy candles in reusable ceramic containers.",
          price: 28.99,
          image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          category: "Home Decor",
          rating: 4.4,
          inStock: true
        }
      ];
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...products];
    
    // Text search
    if (searchTerm) {
      results = results.filter(
        product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (filters.category !== 'all') {
      results = results.filter(product => product.category === filters.category);
    }
    
    // Price filter
    if (filters.price !== 'all') {
      switch(filters.price) {
        case 'under25':
          results = results.filter(product => product.price < 25);
          break;
        case '25to50':
          results = results.filter(product => product.price >= 25 && product.price <= 50);
          break;
        case 'over50':
          results = results.filter(product => product.price > 50);
          break;
        default:
          break;
      }
    }
    
    // Rating filter
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      results = results.filter(product => product.rating >= minRating);
    }
    
    // Stock filter
    if (filters.inStock) {
      results = results.filter(product => product.inStock);
    }
    
    setFilteredProducts(results);
  }, [searchTerm, filters, products]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      category: 'all',
      price: 'all',
      rating: 'all',
      inStock: false
    });
    toast.info("Filters have been reset", {
      icon: () => <RefreshCwIcon className="w-5 h-5" />
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Add to cart function (placeholder for demonstration)
  const addToCart = (product) => {
    toast.success(`${product.name} added to cart!`, {
      icon: () => <CheckIcon className="w-5 h-5" />
    });
  };

  // Render filters section
  const renderFilters = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-white dark:bg-surface-800 rounded-xl shadow-soft mb-6"
    >
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-surface-600 dark:text-surface-300">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-800 dark:text-surface-100"
          >
            <option value="all">All Categories</option>
            <option value="Ceramics">Ceramics</option>
            <option value="Woodwork">Woodwork</option>
            <option value="Textiles">Textiles</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Home Decor">Home Decor</option>
          </select>
        </div>
        
        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-surface-600 dark:text-surface-300">
            Price Range
          </label>
          <select
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-800 dark:text-surface-100"
          >
            <option value="all">All Prices</option>
            <option value="under25">Under $25</option>
            <option value="25to50">$25 to $50</option>
            <option value="over50">Over $50</option>
          </select>
        </div>
        
        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-surface-600 dark:text-surface-300">
            Minimum Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-800 dark:text-surface-100"
          >
            <option value="all">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        
        {/* Stock Filter */}
        <div className="flex items-center">
          <div className="mt-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={() => handleFilterChange('inStock', !filters.inStock)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-surface-300 dark:bg-surface-700 rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary-light transition-colors">
                <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-5"></div>
              </div>
              <span className="ml-3 text-sm font-medium text-surface-600 dark:text-surface-300">
                In Stock Only
              </span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Filter Actions */}
      <div className="px-4 pb-4 md:px-6 md:pb-6 flex justify-end">
        <button
          onClick={resetFilters}
          className="text-sm flex items-center gap-2 text-surface-600 dark:text-surface-300 hover:text-primary"
        >
          <RefreshCwIcon className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </motion.div>
  );

  // Render loading state
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="mb-4"
      >
        <RefreshCwIcon className="w-10 h-10 text-primary" />
      </motion.div>
      <p className="text-surface-600 dark:text-surface-300">Loading products...</p>
    </div>
  );

  // Render product grid
  const renderProducts = () => (
    <>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-surface-600 dark:text-surface-400">
          {filteredProducts.length} products found
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-surface-700 rounded-lg shadow-sm hover:shadow text-sm"
          >
            <FilterIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-8 text-center">
          <XIcon className="w-10 h-10 mx-auto mb-4 text-surface-400" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={resetFilters}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-surface-800 rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white font-medium py-2 px-4 bg-surface-800/80 rounded-lg">
                      Out of Stock
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <CheckIcon className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-primary-dark dark:text-primary-light">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
                      product.inStock
                        ? 'bg-primary hover:bg-primary-dark text-white'
                        : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBasketIcon className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Explore Our Products
          </h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-2xl">
            Browse our collection of handcrafted items made with care by talented artisans.
            Use the search and filters to find exactly what you're looking for.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-xl shadow-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
              <SearchIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <AnimatePresence>
          {showFilters && renderFilters()}
        </AnimatePresence>
        
        {/* Product Grid */}
        {isLoading ? renderLoading() : renderProducts()}
      </div>
    </section>
  );
};

export default MainFeature;