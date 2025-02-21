// src/pages/BoardWrite.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function BoardWrite() {
   const navigate = useNavigate()
   const [postData, setPostData] = useState({
       title: '',
       content: ''
   })

   const handleSubmit = (e) => {
       e.preventDefault()
       // 여기에 게시글 저장 로직이 들어갈 예정
       console.log('게시글 작성:', postData)
       navigate('/board')  // 작성 후 목록으로 이동
   }

   return (
       <div className="max-w-4xl mx-auto p-4">
           <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>

           <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
               {/* 제목 입력 */}
               <div className="mb-4">
                   <label className="block mb-2 font-semibold">제목</label>
                   <input
                       type="text"
                       value={postData.title}
                       onChange={(e) => setPostData({...postData, title: e.target.value})}
                       className="w-full p-2 border rounded"
                       placeholder="제목을 입력하세요"
                       required
                   />
               </div>

               {/* 내용 입력 */}
               <div className="mb-6">
                   <label className="block mb-2 font-semibold">내용</label>
                   <textarea
                       value={postData.content}
                       onChange={(e) => setPostData({...postData, content: e.target.value})}
                       className="w-full p-2 border rounded h-64 resize-none"
                       placeholder="내용을 입력하세요"
                       required
                   />
               </div>

               {/* 버튼 그룹 */}
               <div className="flex justify-end gap-2">
                   <button
                       type="button"
                       onClick={() => navigate('/board')}
                       className="px-4 py-2 border rounded hover:bg-gray-100"
                   >
                       취소
                   </button>
                   <button
                       type="submit"
                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                   >
                       작성하기
                   </button>
               </div>
           </form>
       </div>
   )
}

export default BoardWrite