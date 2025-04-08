// src/features/auth/components/ErrorAlert.jsx
import React from 'react';
import PropTypes from 'prop-types';

function ErrorAlert({ message }) {
  if (!message) return null;
  
  return (
    <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
      <p>{message}</p>
    </div>
  );
}

ErrorAlert.propTypes = {
  message: PropTypes.string
};

export default ErrorAlert;