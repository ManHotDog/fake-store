import React from 'react';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 flex flex-col h-full">
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
  );
};

export default ProductCard; 