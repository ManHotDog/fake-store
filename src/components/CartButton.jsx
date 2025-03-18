import React from 'react';

const CartButton = ({ setShowCart, cart }) => {
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <button 
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      onClick={() => setShowCart(true)}
    >
      <i className="fa-solid fa-cart-shopping"></i>
      {cartItemsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
          {cartItemsCount}
        </span>
      )}
    </button>
  );
};

export default CartButton; 