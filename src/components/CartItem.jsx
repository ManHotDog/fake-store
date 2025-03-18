import React from 'react';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex items-center mb-4 border-b pb-4">
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
  );
};

export default CartItem; 