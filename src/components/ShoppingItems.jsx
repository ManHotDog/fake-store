import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ShoppingItems = ({ showCartProp, setShowCartProp }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  
  // Use the prop if provided, otherwise use local state
  const showCart = showCartProp !== undefined ? showCartProp : useState(false)[0];
  const setShowCart = setShowCartProp || useState(false)[1];

  // Calculate cart items count
  const cartItemsCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Export cart count using window event
  useEffect(() => {
    // Create custom event with cart data
    const updateCartEvent = new CustomEvent('cartUpdated', { 
      detail: { count: cartItemsCount(), items: cart } 
    });
    // Dispatch the event
    window.dispatchEvent(updateCartEvent);
  }, [cart, cartItemsCount]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        
        // Extract categories
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products when category or price range changes
    let result = products;
    
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    setFilteredProducts(result);
  }, [selectedCategory, priceRange, products]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceChange = (e, type) => {
    const value = parseFloat(e.target.value);
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Filter Products</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-2 font-medium">Category</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block mb-2 font-medium">Min Price</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(e, 'min')}
                min="0"
              />
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block mb-2 font-medium">Max Price</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, 'max')}
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 flex flex-col h-full">
              <div className="h-48 p-4 bg-gray-100 flex items-center justify-center group">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">{product.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="mt-auto pt-4">
                  <button 
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all duration-300 hover:shadow-md"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No products match your filters</h3>
          <p className="text-gray-500 mt-2">Try changing your filter criteria</p>
        </div>
      )}
      
      {/* Shopping Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <button 
              className="text-gray-500 hover:text-gray-700" 
              onClick={() => setShowCart(false)}
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          
          {cart.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center mb-4 border-b pb-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-12 h-12 object-contain mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center">
                          <button 
                            className="w-6 h-6 bg-gray-200 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >-</button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            className="w-6 h-6 bg-gray-200 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >+</button>
                        </div>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between font-bold text-xl mb-4">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Cart Toggle Button - Only show if not using external control */}
      {setShowCartProp === undefined && (
        <button 
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowCart(true)}
        >
          <i className="fa-solid fa-cart-shopping"></i>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default ShoppingItems;
