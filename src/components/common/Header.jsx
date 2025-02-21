// src/components/common/Header.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">달그락</Link>
        
        <nav className="flex gap-3">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md border ${
              location.pathname === '/' 
                ? 'border-blue-500 text-blue-500' 
                : 'border-gray-200 hover:border-blue-500 hover:text-blue-500'
            } transition-all`}
          >
            홈
          </Link>
          {/* ... 다른 네비게이션 링크들 */}
        </nav>
      </div>
    </header>
  )
}

export default Header