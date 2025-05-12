// src/components/common/Layout.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Layout({ children }) {
  const navigate = useNavigate();
  
  // 홈으로 이동하는 함수
  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-green-500 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">달그락</Link>
          <nav className="flex space-x-6">
            {/* 홈 버튼에 onClick 이벤트 핸들러 추가 */}
            <Link to="/" onClick={goToHome} className="text-white hover:text-white/80">홈</Link>
            <Link to="/board" className="text-white hover:text-white/80">게시판</Link>
            <Link to="/favorites" className="text-white hover:text-white/80">즐겨찾기</Link>
            <Link to="/profile" className="text-white hover:text-white/80">프로필</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-gray-100 p-4">
        <div className="container mx-auto text-center text-gray-600">
          © 2024 달그락
        </div>
      </footer>
    </div>
  )
}

export default Layout