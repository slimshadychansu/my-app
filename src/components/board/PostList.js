// src/components/board/PostList.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../store/atoms';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import Button from '../common/Button';
import { PageTransition } from '../animation/PageTransition';
import api from '../../api';

function PostList() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useRecoilValue(userState);
  
  // 게시글 목록 및 상태
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 필터링 및 검색 상태
  const [category, setCategory] = useState('all');
  const [searchType, setSearchType] = useState('title');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortType, setSortType] = useState('latest');
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await api.board.getAll({
          category: category !== 'all' ? category : undefined,
          searchType: searchKeyword ? searchType : undefined,
          searchKeyword,
          sortType,
          page: currentPage
        });
        
        setPosts(response.data.posts || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error('게시글 목록 로드 실패:', err);
        setError('게시글 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [category, searchType, searchKeyword, sortType, currentPage]);
  
  // 게시글 작성 페이지로 이동
  const handleWriteClick = () => {
    if (!user.isLoggedIn) {
      alert('로그인 후 게시글을 작성할 수 있습니다.');
      navigate('/login', { state: { from: '/board/write' } });
      return;
    }
    
    navigate('/board/write');
  };
  
  // 게시글 검색
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 1페이지로 이동
  };
  
  // 카테고리 필터링
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'recipe', name: '레시피' },
    { id: 'daily', name: '일상' },
    { id: 'question', name: '질문' },
    { id: 'tip', name: '꿀팁' },
  ];
  
  // 정렬 옵션
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'views', label: '조회순' },
    { value: 'likes', label: '좋아요순' },
    { value: 'comments', label: '댓글순' },
  ];
  
  // 검색 타입 옵션
  const searchTypes = [
    { value: 'title', label: '제목' },
    { value: 'content', label: '내용' },
    { value: 'author', label: '작성자' },
    { value: 'tag', label: '태그' },
  ];
  
  // 페이지 번호 목록 생성
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">커뮤니티</h1>
          <Button
            onClick={handleWriteClick}
          >
            글쓰기
          </Button>
        </div>
        
        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                category === cat.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        {/* 검색 및 정렬 */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="flex-shrink-0">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {searchTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <input 
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="flex-1 border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            
            <Button variant="secondary" type="submit">
              검색
            </Button>
          </form>
        </div>
        
        {/* 로딩 및 에러 */}
        {isLoading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}
        
        {/* 게시글 목록 */}
        {!isLoading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {posts.length === 0 ? (
              <div className="py-16 text-center text-gray-500 dark:text-gray-400">
                검색 결과가 없습니다.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">제목</th>
                    <th className="py-3 px-4 text-left">작성자</th>
                    <th className="py-3 px-4 text-right">작성일</th>
                    <th className="py-3 px-4 text-right">조회</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr 
                      key={post.id}
                      onClick={() => navigate(`/board/${post.id}`)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="mr-2 text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {post.category}
                          </span>
                          <span className="font-medium dark:text-white">{post.title}</span>
                          {post.commentCount > 0 && (
                            <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">
                              [{post.commentCount}]
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 dark:text-gray-300">{post.author}</td>
                      <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">
                        {post.viewCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                이전
              </button>
            )}
            
            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === pageNum 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                다음
              </button>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // 오늘
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diffDays < 7) {
    // 일주일 이내
    return `${diffDays}일 전`;
  } else {
    // 일주일 이상
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}

export default PostList;