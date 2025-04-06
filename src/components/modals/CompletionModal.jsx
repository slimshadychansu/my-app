// src/components/modals/CompletionModal.jsx
import React from 'react';

function CompletionModal({ isOpen, onClose, recipeName, onRate, onReturn }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 dark:text-white">요리 완료!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {recipeName} 요리가 완료되었습니다. 맛있게 드세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={onRate}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              요리 평가하기
            </button>
            <button 
              onClick={onReturn || onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              채팅으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletionModal;