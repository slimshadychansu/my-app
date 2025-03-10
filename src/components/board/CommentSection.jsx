// src/components/CommentSection.jsx
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { commentsState } from '../../store/comments';
import { userState } from '../../store/atoms';

function CommentSection({ postId }) {
  const [comments, setComments] = useRecoilState(commentsState);
  const user = useRecoilValue(userState);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  // Filter comments for this post
  const postComments = comments.filter(comment => comment.postId === postId);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Handle comment submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user.isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: `comment${Date.now()}`, // Generate unique ID
      postId,
      author: user.name || '익명',
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  // Handle comment deletion
  const handleDelete = (commentId) => {
    if (window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  // Start editing a comment
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  // Save edited comment
  const handleEditSave = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, content: editText }
        : comment
    ));
    setEditingCommentId(null);
    setEditText('');
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 dark:text-white">댓글 {postComments.length}개</h3>
      
      {/* Comment input form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user.isLoggedIn ? "댓글을 작성하세요" : "로그인 후 댓글을 작성할 수 있습니다"}
            className="flex-1 p-3 border rounded-lg resize-none h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={!user.isLoggedIn}
          />
          <button
            type="submit"
            disabled={!user.isLoggedIn || !newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 self-end disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            등록
          </button>
        </div>
      </form>
      
      {/* Comments list */}
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
                // Edit mode
                <div className="mt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleEditCancel}
                      className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleEditSave(comment.id)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <div>
                  <p className="dark:text-gray-300">{comment.content}</p>
                  {user.name === comment.author && (
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleEditStart(comment)}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        삭제
                      </button>
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