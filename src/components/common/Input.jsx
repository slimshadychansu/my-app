// components/common/Input.jsx
import React from 'react'
function Input({
  type = 'text',
  value,
  onChange,
  label,
  placeholder,
  error,
  required = false,
  disabled = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm md:text-base font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full 
          px-3 
          py-2 
          md:py-3 
          text-sm 
          md:text-base 
          border 
          rounded-lg 
          transition-colors
          focus:outline-none 
          focus:ring-2
          ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />

      {error && (
        <p className="mt-1 text-xs md:text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}