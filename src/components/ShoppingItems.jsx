import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductFilter from './ProductFilter';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyResults from './EmptyResults';
import CartSidebar from './CartSidebar';
import CartButton from './CartButton';

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
    <div className="container mx-auto pl-12 pr-12">
      <ProductFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
      />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
      
      {filteredProducts.length === 0 && !loading && <EmptyResults />}
      
      <CartSidebar 
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
        clearCart={clearCart}
      />
      
      {/* Cart Toggle Button - Only show if not using external control */}
      {setShowCartProp === undefined && (
        <CartButton setShowCart={setShowCart} cart={cart} />
      )}
    </div>
  );
};

export default ShoppingItems;
