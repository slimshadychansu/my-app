import React from 'react';

export default function ErrorAlert({ message }) {
  return message ? (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
      {message}
    </div>
  ) : null;
}