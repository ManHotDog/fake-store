import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import ShoppingItems from './components/ShoppingItems.jsx'

function App() {
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = (event) => {
      setCartCount(event.detail.count);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center gap-x-2">
          <img src={reactLogo} alt="logo" className="w-12 h-12 object-contain" />
            <h1 className="text-xl font-bold">FakeStore</h1>
          </div>
          <div className="relative cursor-pointer mr-4" onClick={() => setShowCart(prev => !prev)}>
            <i className="fa-solid fa-cart-shopping text-2xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </div>
      </header>
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold">Fake Store</h1>
      </div>
      <ShoppingItems showCartProp={showCart} setShowCartProp={setShowCart} />
    </>
  )
}

export default App
