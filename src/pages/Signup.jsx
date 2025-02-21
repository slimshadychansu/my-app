// src/pages/SignUp.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
 const [formData, setFormData] = useState({
   email: '',
   password: '',
   confirmPassword: '',
   name: ''
 })
 const [error, setError] = useState('')
 const navigate = useNavigate()

 const handleSubmit = (e) => {
   e.preventDefault()
   if (formData.password !== formData.confirmPassword) {
     setError('비밀번호가 일치하지 않습니다')
     return
   }
   console.log('회원가입 시도:', formData)
 }

 return (
   <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
     <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
     
     <form onSubmit={handleSubmit} className="space-y-4">
       <div>
         <label className="block mb-1">이름</label>
         <input 
           type="text"
           value={formData.name}
           onChange={(e) => setFormData({...formData, name: e.target.value})}
           className="w-full p-2 border rounded"
           required
         />
       </div>

       <div>
         <label className="block mb-1">이메일</label>
         <input 
           type="email"
           value={formData.email}
           onChange={(e) => setFormData({...formData, email: e.target.value})}
           className="w-full p-2 border rounded"
           required
         />
       </div>

       <div>
         <label className="block mb-1">비밀번호</label>
         <input 
           type="password"
           value={formData.password}
           onChange={(e) => setFormData({...formData, password: e.target.value})}
           className="w-full p-2 border rounded"
           required
         />
       </div>

       <div>
         <label className="block mb-1">비밀번호 확인</label>
         <input 
           type="password"
           value={formData.confirmPassword}
           onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
           className="w-full p-2 border rounded"
           required
         />
       </div>

       {error && (
         <p className="text-red-500 text-sm">{error}</p>
       )}

       <button 
         type="submit"
         className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
       >
         회원가입
       </button>
     </form>

     <p className="mt-4 text-center">
       이미 계정이 있으신가요?{' '}
       <button 
         onClick={() => navigate('/login')}
         className="text-blue-500 hover:underline"
       >
         로그인
       </button>
     </p>
   </div>
 )
}

export default SignUp