// src/features/board/hooks/useBoardDetail.js
import { useState, useEffect, useCallback } from 'react';
import { fetchPostById } from '../api/boardApi'; // 실제 API 함수 필요

export function useBoardDetail(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPostById(postId);
      setPost(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { 
    post, 
    loading, 
    error,
    refetch: fetchPost 
  };
}