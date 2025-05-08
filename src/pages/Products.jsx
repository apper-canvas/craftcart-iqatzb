import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Handcrafted Ceramic Mug",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Ceramics",
      rating: 4.8,
      description: "Handcrafted ceramic mug with unique glazing technique. Each piece is one-of-a-kind with slight variations in pattern."
    },
    {
      id: 2,
      name: "Artisan Wooden Bowl",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1603031612576-5a1e2a18b42c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Woodwork",
      rating: 4.6,
      description: "Hand-carved wooden bowl made from sustainable oak. Perfect for serving salads or as a decorative piece."
    },
    {
      id: 3,
      name: "Hand-woven Basket",
      price: 32.50,
      image: "https://images.unsplash.com/photo-1567225591450-06036b3392a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Textiles",
      rating: 4.9,
      description: "Traditional hand-woven basket using natural fibers. Versatile for storage or as a beautiful display piece."
    },
    {
      id: 4,
      name: "Custom Silver Necklace",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Jewelry",
      rating: 5.0,
      description: "Delicate silver necklace handcrafted by our skilled jeweler. Simple yet elegant design for everyday wear."
    },
    {
      id: 5,
      name: "Woven Wall Hanging",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1582884177591-b4be6e56a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Textiles",
      rating: 4.7,
      description: "Beautifully woven wall hanging with modern designs and natural materials. Adds texture and warmth to any room."
    },
    {
      id: 6,
      name: "Handmade Leather Journal",
      price: 28.50,
      image: "https://images.unsplash.com/photo-1589849652973-e0b7b517227d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Leather",
      rating: 4.5,
      description: "Genuine leather journal with hand-stitched binding and recycled cotton pages. Perfect for sketching or journaling."
    },
    {
      id: 7,
      name: "Ceramic Planter",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Ceramics",
      rating: 4.4,
      description: "Modern ceramic planter with unique textured finish. Each planter is wheel-thrown and glazed by hand."
    },
    {
      id: 8,
      name: "Wooden Cutting Board",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1588165171080-c89acfa6c8d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Woodwork",
      rating: 4.8,
      description: "End-grain cutting board made from maple and walnut. Handcrafted with care for durability and beauty."
    }
  ]);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  
  const GridIcon = getIcon('Grid');
  const ListIcon = getIcon('List');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const ShoppingBagIcon = getIcon('ShoppingBag');
  const StarIcon = getIcon('Star');
  const HeartIcon = getIcon('Heart');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  
  // Categories with count
  const categories = [
    { name: 'All', count: products.length },
    { name: 'Ceramics', count: products.filter(p => p.category === 'Ceramics').length },
    { name: 'Woodwork', count: products.filter(p => p.category === 'Woodwork').length },
    { name: 'Textiles', count: products.filter(p => p.category === 'Textiles').length },
    { name: 'Jewelry', count: products.filter(p => p.category === 'Jewelry').length },
    { name: 'Leather', count: products.filter(p => p.category === 'Leather').length }
  ];
  
  useEffect(() => {
    // Apply filters and sorting
    let result = [...products];
    
    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    switch(sortOrder) {
      case 'popular':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // In a real app, you'd sort by date added
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [products, activeCategory, sortOrder, searchQuery, priceRange]);
  
  const addToCart = (product) => {
    toast.success(`Added ${product.name} to cart!`);
  };
  
  const addToWishlist = (product) => {
    toast.info(`Added ${product.name} to wishlist!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface-50 dark:bg-surface-900"
    >
      {/* Header */}
      <div className="bg-surface-100 dark:bg-surface-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="text-primary hover:text-primary-dark dark:hover:text-primary-light">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Our Products</h1>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="input-field"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-card p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.name}
                    className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${
                      activeCategory === category.name 
                        ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:w-3/4">
            <p className="mb-4 text-surface-600 dark:text-surface-400">Showing {filteredProducts.length} results</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="product-card group"
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button 
                      onClick={() => addToWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white dark:bg-surface-800 rounded-full shadow-md hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <HeartIcon className="w-5 h-5 text-surface-500 hover:text-primary" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-primary hover:bg-primary-dark text-white rounded-full py-3 px-6 flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
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
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-surface-400 dark:text-surface-500 mb-4">
                  <SearchIcon className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-surface-600 dark:text-surface-400">Try changing your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Products;
