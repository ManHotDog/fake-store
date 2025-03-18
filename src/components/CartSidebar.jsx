import React from 'react';
import CartItem from './CartItem';

const CartSidebar = ({ 
  showCart, 
  setShowCart, 
  cart, 
  updateQuantity, 
  removeFromCart, 
  calculateTotal,
  clearCart
}) => {
  return (
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
                <CartItem 
                  key={item.id} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                />
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
  );
};

export default CartSidebar; 