import React from 'react';

const ProductFilter = ({ 
  categories, 
  selectedCategory, 
  handleCategoryChange, 
  priceRange, 
  handlePriceChange 
}) => {
  return (
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
  );
};

export default ProductFilter; 