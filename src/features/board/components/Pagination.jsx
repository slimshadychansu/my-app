import React from 'react';

const Pagination = React.memo(({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) }, 
    (_, i) => i + 1
  );

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === number 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
});

export default Pagination;