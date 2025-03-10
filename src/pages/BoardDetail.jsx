import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';
import { commentsState } from "../store/comments";
import CommentSection from '../components/board/CommentSection';

// 게시글 데이터 (예시)
const MOCK_POSTS = [
  {
    id: 'post1',
    title: '김치찌개 만드는 나만의 비법',
    content: '맛있는 김치찌개를 만들기 위한 비법을 공유합니다. 먼저, 잘 익은 김치를 사용하는 것이 중요합니다...',
    author: '요리왕',
    createdAt: '2023-01-15T10:30:00Z',
    views: 245,
    likes: 32
  },
  {
    id: 'post2',
    title: '초보자도 쉽게 만드는 파스타 레시피',
    content: '요리 초보자도 쉽게 따라할 수 있는 파스타 레시피를 소개합니다. 필요한 재료는...',
    author: '파스타마스터',
    createdAt: '2023-01-14T14:20:00Z',
    views: 198,
    likes: 27
  }
];

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  
  // 게시글 데이터 로드 (API 대신 임시로 목업 데이터 사용)
  // BoardDetail.jsx의 useEffect 부분 수정
useEffect(() => {
    const fetchPost = () => {
      setIsLoading(true);
      // ID 형식을 처리하는 로직 추가
      const searchId = id.startsWith('post') ? id : `post${id}`;
      const foundPost = MOCK_POSTS.find(post => post.id === searchId);
      
      if (foundPost) {
        setTimeout(() => {
          setPost(foundPost);
          setIsLoading(false);
        }, 500);
      } else {
        navigate('/board');
      }
    };
    
    fetchPost();
  }, [id, navigate]);
  
  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // 게시글 좋아요 토글
  const handleLikeToggle = () => {
    if (!user.isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    
    setLiked(!liked);
    setPost(prev => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1
    }));
  };
  
  // 글 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/board/edit/${id}`);
  };
  
  // 글 삭제 처리
  const handleDelete = () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      // API 호출하여 삭제 처리 (실제 구현 필요)
      alert('게시글이 삭제되었습니다.');
      navigate('/board');
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* 게시글 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 dark:text-white">{post.title}</h1>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>작성자: {post.author}</span>
              <span>작성일: {formatDate(post.createdAt)}</span>
              <span>조회수: {post.views}</span>
            </div>
            {post.author === user.name && (
              <div className="space-x-2">
                <button 
                  onClick={handleEdit}
                  className="text-blue-500 hover:text-blue-600"
                >
                  수정
                </button>
                <button 
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 게시글 본문 */}
        <div className="border-t border-b py-6 mb-4 dark:border-gray-700">
          <div className="prose max-w-none dark:prose-invert">
            <p className="dark:text-gray-300">{post.content}</p>
          </div>
        </div>
        
        {/* 좋아요 버튼 */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              liked 
                ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            <svg 
              className="w-5 h-5" 
              fill={liked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            좋아요 {post.likes + (liked ? 1 : 0)}
          </button>
        </div>
        
        {/* 목록으로 돌아가기 버튼 */}
        <div className="flex justify-between">
          <button 
            onClick={() => navigate('/board')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            목록으로
          </button>
        </div>
        
        {/* 댓글 섹션 */}
        <CommentSection postId={id} />
      </div>
    </div>
  );
}

export default BoardDetail;