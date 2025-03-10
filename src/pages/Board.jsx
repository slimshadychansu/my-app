// src/pages/Board.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageTransition } from '../components/animation/PageTransition'
import { FadeIn } from '../components/animation/FadeIn'

function Board() {
    const navigate = useNavigate()
    const [searchType, setSearchType] = useState('title')
    const [searchKeyword, setSearchKeyword] = useState('')
    const [sortType, setSortType] = useState('latest') // 정렬 상태 추가
    const [currentPage, setCurrentPage] = useState(1) // 페이지네이션 상태
    const postsPerPage = 10 // 페이지당 게시글 수

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
        },
        // 테스트를 위해 더미 데이터 추가
        ...Array(18).fill().map((_, i) => ({
            id: i + 3,
            title: `테스트 게시글 ${i + 1}`,
            author: `작성자${i + 1}`,
            date: '2024-01-06',
            views: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20)
        }))
    ])

    // 정렬 함수
    const sortPosts = (posts) => {
        return [...posts].sort((a, b) => {
            switch (sortType) {
                case 'latest':
                    return new Date(b.date) - new Date(a.date)
                case 'views':
                    return b.views - a.views
                case 'comments':
                    return b.comments - a.comments
                default:
                    return 0
            }
        })
    }

    // 검색 함수
    const handleSearch = () => {
        if (!searchKeyword.trim()) return posts
        
        return posts.filter(post => {
            if (searchType === 'title') {
                return post.title.toLowerCase().includes(searchKeyword.toLowerCase())
            } else if (searchType === 'author') {
                return post.author.toLowerCase().includes(searchKeyword.toLowerCase())
            }
            return true
        })
    }

    // 페이지네이션 계산
    const filteredAndSortedPosts = sortPosts(handleSearch())
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = filteredAndSortedPosts.slice(indexOfFirstPost, indexOfLastPost)
    const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage)

    // 페이지 번호 배열 생성
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    return (
        <PageTransition>
        <div className="max-w-4xl mx-auto p-4">
            
            <div className="flex justify-between items-center mb-6">
            <FadeIn>
                <h1 className="text-2xl font-bold">커뮤니티</h1>
            </FadeIn>    
                <button 
                    onClick={() => navigate('/board/write')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    글쓰기
                </button>
            </div>

            {/* 정렬 옵션 추가 */}
            <div className="flex justify-end mb-4">
                <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="latest">최신순</option>
                    <option value="views">조회순</option>
                    <option value="comments">댓글순</option>
                </select>
            </div>

            {/* 게시글 목록 */}
            <div className="bg-white rounded-lg shadow">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-bold text-gray-500">
                    <div className="col-span-6">제목</div>
                    <div className="col-span-2">작성자</div>
                    <div className="col-span-2">작성일</div>
                    <div className="col-span-1">조회</div>
                    <div className="col-span-1">댓글</div>
                </div>

                {currentPosts.map(post => (
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

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-6 gap-2">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    이전
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`px-4 py-2 rounded ${
                            currentPage === number 
                            ? 'bg-blue-500 text-white' 
                            : 'border hover:bg-gray-50'
                        }`}
                    >
                        {number}
                    </button>
                ))}
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    다음
                </button>
            </div>

            {/* 검색 */}
            <div className="mt-4 flex gap-2">
                <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="title">제목</option>
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
                    onClick={() => setCurrentPage(1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    검색
                </button>
            </div>
        </div>
        </PageTransition>
    )
}

export default Board