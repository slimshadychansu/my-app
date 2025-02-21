import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import Home from './pages/Home'
import Search from './pages/Search'
import Recommend from './pages/Recommend'
import Board from './pages/Board'
import BoardWrite from './pages/BoardWrite'
import BoardDetail from './pages/BoardDetail'
import BoardEdit from './pages/BoardEdit'
import MyPage from './pages/MyPage'
import UserProfile from './components/user/UserProfile'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import CookingGuide from './pages/CookingGuide'
import Favorites from './pages/Favorites'

function App() {
 return (
   <RecoilRoot>
     <BrowserRouter>
       <div className=" w-64 h-64">
         <header className="bg-white shadow-lg">
           <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
             <h1 className="text-2xl font-bold text-gray-800">달그락</h1>
             <div className="flex gap-6">
               <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors">홈</Link>
               <Link to="/search" className="text-gray-600 hover:text-blue-500 transition-colors">검색</Link>
               <Link to="/recommend" className="text-gray-600 hover:text-blue-500 transition-colors">추천</Link>
               <Link to="/board" className="text-gray-600 hover:text-blue-500 transition-colors">게시판</Link>
               <Link to="/favorites" className="text-gray-600 hover:text-blue-500 transition-colors">즐겨찾기</Link>
               <Link to="/profile" className="text-gray-600 hover:text-blue-500 transition-colors">프로필</Link>
             </div>
           </nav>
         </header>
         <main className="flex-1">
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/search" element={<Search />} />
             <Route path="/recommend" element={<Recommend />} />
             <Route path="/board" element={<Board />} />
             <Route path="/board/write" element={<BoardWrite />} />
             <Route path="/board/:id" element={<BoardDetail />} />
             <Route path="/board/edit/:id" element={<BoardEdit />} />
             <Route path="/mypage" element={<MyPage />} />
             <Route path="/profile" element={<UserProfile />} />
             <Route path="/login" element={<Login />} />
             <Route path="/signup" element={<SignUp />} />
             <Route path="/guide" element={<CookingGuide />} />
             <Route path="/favorites" element={<Favorites />} />
           </Routes>
         </main>
         <footer className="bg-gray-100 py-4">
           <div className="container mx-auto text-center text-gray-600">
             © 2024 달그락
           </div>
         </footer>
       </div>
     </BrowserRouter>
   </RecoilRoot>
 )
}

export default App