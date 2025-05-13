// src/components/board/PostDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../store/atoms';
import CommentSection from './CommentSection';
import { PageTransition } from '../animation/PageTransition';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import api from '../../api';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  
  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await api.board.getById(id);
        setPost(response.data);
        setLiked(response.data.userLiked || false);
      } catch (err) {
        console.error('게시글 로드 실패:', err);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  // 좋아요 토글 처리
  const handleLikeToggle = async () => {
    if (!user.isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      navigate('/login', { state: { from: `/board/${id}` } });
      return;
    }
    
    try {
      await api.board.toggleLike(id);
      setLiked(!liked);
      setPost(prev => ({
        ...prev,
        likeCount: liked ? prev.likeCount - 1 : prev.likeCount + 1
      }));
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };
  
  // 게시글 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/board/edit/${id}`);
  };
  
  // 게시글 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await api.board.delete(id);
      navigate('/board', { state: { message: '게시글이 삭제되었습니다.' } });
    } catch (err) {
      console.error('게시글 삭제 실패:', err);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!post) return <ErrorAlert message="게시글을 찾을 수 없습니다." />;
  
  const isAuthor = user.id === post.authorId;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => navigate('/board')}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            목록으로
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold dark:text-white">{post.title}</h1>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <span className="mr-4">{post.author}</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex text-gray-600 dark:text-gray-400 text-sm">
                <span className="mr-3">조회 {post.viewCount}</span>
                <span>댓글 {post.commentCount}</span>
              </div>
            </div>
          </div>
          
          <div className="post-content mb-6">
            {post.images && post.images.length > 0 && (
              <div className="post-images mb-4">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`게시글 이미지 ${index + 1}`}
                    className="max-w-full max-h-96 mb-4 rounded-lg"
                  />
                ))}
              </div>
            )}
            
            <div className="prose dark:prose-invert max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
              ))}
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1 ${
                liked 
                  ? 'text-red-500 dark:text-red-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>좋아요 {post.likeCount || 0}</span>
            </button>
            
            {isAuthor && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleEdit}
                >
                  수정
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
          
          <CommentSection postId={id} />
        </div>
      </div>
    </PageTransition>
  );
}

export default PostDetail;