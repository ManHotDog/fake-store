import React from 'react';

const EmptyResults = () => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium">No products match your filters</h3>
      <p className="text-gray-500 mt-2">Try changing your filter criteria</p>
    </div>
  );
};

export default EmptyResults; 