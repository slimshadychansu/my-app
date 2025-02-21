// src/pages/Board.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Board() {
    const navigate = useNavigate()
    const [searchType, setSearchType] = useState('title')
    const [searchKeyword, setSearchKeyword] = useState('')

    const [posts] = useState([
        {
            id: 1,
            title: '김치찌개 맛있게 만드는 팁!',
            author: '요리왕',
            date: '2024-01-06',
            views: 128,
            comments: 15
        },
        {
            id: 2,
            title: 'AI 추천 레시피 후기입니다',
            author: '초보쉐프',
            date: '2024-01-06',
            views: 85,
            comments: 8
        }
    ])

    // 검색 함수 
    const handleSearch = () => {
        // 검색어가 비어있으면 전체 게시글 표시
        if (!searchKeyword.trim()) {
            return posts
        }

        // 검색 조건에 따라 게시글 필터링
        return posts.filter(post => {
            if (searchType === 'title') {
                return post.title.toLowerCase().includes(searchKeyword.toLowerCase())
            } else if (searchType === 'content') {
                return post.content.toLowerCase().includes(searchKeyword.toLowerCase())
            } else if (searchType === 'author') {
                return post.author.toLowerCase().includes(searchKeyword.toLowerCase())
            }
            return true
        })
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">커뮤니티</h1>
                <button 
                    onClick={() => navigate('/board/write')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    글쓰기
                </button>
            </div>

            {/* 게시글 목록 */}
            <div className="bg-white rounded-lg shadow">
                {/* 게시글 헤더 */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-bold text-gray-500">
                    <div className="col-span-6">제목</div>
                    <div className="col-span-2">작성자</div>
                    <div className="col-span-2">작성일</div>
                    <div className="col-span-1">조회</div>
                    <div className="col-span-1">댓글</div>
                </div>

                {/* 게시글 목록 */}
                {handleSearch().map(post => (
                    <div 
                        key={post.id}
                        className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/board/${post.id}`)}
                    >
                        <div className="col-span-6">{post.title}</div>
                        <div className="col-span-2">{post.author}</div>
                        <div className="col-span-2">{post.date}</div>
                        <div className="col-span-1">{post.views}</div>
                        <div className="col-span-1">{post.comments}</div>
                    </div>
                ))}
            </div>

            {/* 검색 */}
            <div className="mt-4 flex gap-2">
                <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="author">작성자</option>
                </select>
                <input 
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    className="flex-1 border p-2 rounded"
                />
                <button 
                    onClick={handleSearch}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    검색
                </button>
            </div>
        </div>
    )
}

export default Board