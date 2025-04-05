// src/pages/BoardEdit.jsx
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function BoardEdit() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [postData, setPostData] = useState({
        title: '김치찌개 맛있게 만드는 팁!',
        content: '안녕하세요! 오늘은 제가 김치찌개를 맛있게 만드는 방법을 공유해드리려고 합니다.'
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // 여기에 게시글 수정 로직이 들어갈 예정
        console.log('게시글 수정:', postData)
        navigate(`/board/${id}`)
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">제목</label>
                    <input
                        type="text"
                        value={postData.title}
                        onChange={(e) => setPostData({...postData, title: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">내용</label>
                    <textarea
                        value={postData.content}
                        onChange={(e) => setPostData({...postData, content: e.target.value})}
                        className="w-full p-2 border rounded h-64 resize-none"
                        required
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/board/${id}`)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    )
}

export default BoardEdit;