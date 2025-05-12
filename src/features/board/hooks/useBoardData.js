// src/features/board/hooks/useBoardData.js
import { useState, useCallback, useEffect } from 'react';
import boardApi from '../api/boardApi';
export function useBoardData() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 필터링 상태
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortType, setSortType] = useState('latest');
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = useCallback(async () => {
  setLoading(true);
  try {
    // getPosts를 fetchPosts로 변경
    const response = await boardApi.fetchPosts({
      category: activeCategory,
      tag: selectedTag,
      searchType,
      searchKeyword,
      sortType,
      page: currentPage
    });
    
    setPosts(response.data.posts);
    setTotalPages(response.data.totalPages);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [activeCategory, selectedTag, searchType, searchKeyword, sortType, currentPage]);
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    activeCategory, 
    setActiveCategory,
    selectedTag, 
    setSelectedTag,
    searchType,
    setSearchType,
    searchKeyword,
    setSearchKeyword,
    sortType,
    setSortType,
    currentPage, 
    setCurrentPage,
    totalPages
  };
}