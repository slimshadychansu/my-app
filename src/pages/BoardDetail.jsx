// src/pages/BoardDetail.jsx
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function BoardDetail() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [post] = useState({
        id: 1,
        title: '김치찌개 맛있게 만드는 팁!',
        content: '안녕하세요! 오늘은 제가 김치찌개를 맛있게 만드는 방법을 공유해드리려고 합니다.',
        author: '요리왕',
        date: '2024-01-06',
        views: 128,
        comments: [
            {
                id: 1,
                author: '초보쉐프',
                content: '정말 좋은 팁이네요! 감사합니다.',
                date: '2024-01-06'
            }
        ]
    })

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    <div className="text-gray-500">조회 {post.views}</div>
                </div>
                
                <div className="flex justify-between text-gray-500 text-sm mb-6">
                    <div>작성자: {post.author}</div>
                    <div>작성일: {post.date}</div>
                </div>

                <div className="border-t border-b py-4 mb-4">
                    {post.content}
                </div>

                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => navigate('/board')}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        목록
                    </button>
                    <button 
                        onClick={() => navigate(`/board/edit/${id}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        수정
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BoardDetail