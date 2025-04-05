import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../../store/atoms';
import { commentsState } from '../../store/comments';
import { commentService } from '../../api/apiServices';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

function CommentSection({ postId }) {
  const [comments, setComments] = useRecoilState(commentsState);
  const user = useRecoilValue(userState);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // 댓글 관련 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 특정 게시물의 댓글 필터링
  const postComments = comments.filter(comment => comment.postId === postId);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 댓글 목록 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await commentService.getByPostId(postId);
        setComments(response.data);
      } catch (error) {
        console.error('댓글 불러오기 실패:', error);
        setError('댓글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, setComments]);

  // 댓글 생성 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const commentData = {
        postId: postId,
        content: newComment
      };

      const response = await commentService.create(commentData);
      
      // 새로 생성된 댓글을 상태에 추가
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      setError('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 삭제 핸들러
  const handleDelete = async (commentId) => {
    if (window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      try {
        await commentService.delete(commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        setError('댓글 삭제에 실패했습니다.');
      }
    }
  };

  // 댓글 수정 시작
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  // 댓글 수정 저장
  const handleEditSave = async (commentId) => {
    try {
      // 실제 API 업데이트 로직 추가 필요 (현재 미구현)
      const updatedComments = comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editText }
          : comment
      );
      setComments(updatedComments);
      setEditingCommentId(null);
      setEditText('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      setError('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-8">
      {/* 에러 발생 시 에러 알림 */}
      {error && <ErrorAlert message={error} />}

      <h3 className="text-xl font-bold mb-4 dark:text-white">댓글 {postComments.length}개</h3>
      
      {/* 댓글 입력 폼 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user.isLoggedIn ? "댓글을 작성하세요" : "로그인 후 댓글을 작성할 수 있습니다"}
            className="flex-1 p-3 border rounded-lg resize-none h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={!user.isLoggedIn}
          />
          <Button 
            type="submit"
            disabled={!user.isLoggedIn || !newComment.trim() || isSubmitting}
            className="self-end"
          >
            {isSubmitting ? <LoadingSpinner size="small" /> : '등록'}
          </Button>
        </div>
      </form>
      
      {/* 댓글 목록 */}
      <div className="space-y-4">
        {postComments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            첫 댓글을 작성해보세요!
          </p>
        ) : (
          postComments.map(comment => (
            <div 
              key={comment.id} 
              className="p-4 border-b dark:border-gray-700 last:border-0"
            >
              <div className="flex justify-between mb-2">
                <div className="font-medium dark:text-white">{comment.author}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
              
              {editingCommentId === comment.id ? (
                // 수정 모드
                <div className="mt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={handleEditCancel}
                    >
                      취소
                    </Button>
                    <Button 
                      onClick={() => handleEditSave(comment.id)}
                    >
                      저장
                    </Button>
                  </div>
                </div>
              ) : (
                // 일반 모드
                <div>
                  <p className="dark:text-gray-300">{comment.content}</p>
                  {user.name === comment.author && (
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        variant="text" 
                        className="text-blue-500"
                        onClick={() => handleEditStart(comment)}
                      >
                        수정
                      </Button>
                      <Button 
                        variant="text" 
                        className="text-red-500"
                        onClick={() => handleDelete(comment.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;