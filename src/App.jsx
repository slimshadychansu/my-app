import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import Home from './pages/Home'
import Board from './pages/Board'
import BoardWrite from './pages/BoardWrite'
import BoardDetail from './pages/BoardDetail'
import BoardEdit from './pages/BoardEdit'
import MyPage from './pages/MyPage'
import UserProfile from './components/user/UserProfile'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import CookingGuide from './pages/CookingGuide'
import Favorites from './pages/Favorites'
import ReviewList from './pages/ReviewList'

function App() {
 return (
   <RecoilRoot>
     <BrowserRouter>
       <div className="min-h-screen flex flex-col">
         <header className="bg-white shadow-lg dark:bg-gray-800">
           <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
             <h1 className="text-2xl font-bold text-gray-800 dark:text-white">달그락</h1>
             <div className="flex gap-6">
               <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">홈</Link>
               <Link to="/board" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">게시판</Link>
               <Link to="/favorites" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">즐겨찾기</Link>
               <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">프로필</Link>
             </div>
           </nav>
         </header>
         <main className="flex-1">
           <Routes>
             <Route path="/" element={<Home />} />
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
             <Route path="/reviews/:recipeTitle" element={<ReviewList />} />
           </Routes>
         </main>
       </div>
     </BrowserRouter>
   </RecoilRoot>
 )
}

export default App