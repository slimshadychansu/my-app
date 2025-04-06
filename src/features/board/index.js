// src/features/board/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../../components/animation/PageTransition';
import { FadeIn } from '../../components/animation/FadeIn';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

// 하위 컴포넌트 임포트
import CategoryFilter from './components/CategoryFilter';
import TagFilter from './components/TagFilter';
import SearchBar from './components/SearchBar';
import BoardList from './components/BoardList';
import Pagination from './components/Pagination';

// 커스텀 훅 임포트
import { useBoardData } from './hooks/useBoardData';

function Board() {
  const navigate = useNavigate();
  
  // 데이터 및 상태 관리 훅 사용
  const { 
    posts,
    popularTags,
    activeCategory,
    searchType,
    searchKeyword,
    sortType,
    currentPage,
    selectedTag,
    isLoading,
    error,
    totalPages,
    pageNumbers,
    setSearchType,
    setSearchKeyword,
    setSortType,
    setCurrentPage,
    handleCategoryChange,
    handleTagClick,
    handleSearch
  } = useBoardData();

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4">
        <FadeIn>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dark:text-white">커뮤니티</h1>
            <Button 
              onClick={() => navigate('/board/write')}
            >
              글쓰기
            </Button>
          </div>
        
          {/* 카테고리 필터 */}
          <CategoryFilter 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange} 
          />
        
          {/* 인기 태그 */}
          <TagFilter 
            popularTags={popularTags} 
            selectedTag={selectedTag} 
            onTagClick={handleTagClick} 
          />
        </FadeIn>
        
        {/* 정렬 및 검색 */}
        <SearchBar 
          searchType={searchType}
          setSearchType={setSearchType}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          sortType={sortType}
          setSortType={setSortType}
          onSearch={handleSearch}
        />
        
        {/* 로딩 스피너 */}
        {isLoading && <LoadingSpinner />}
        
        {/* 에러 메시지 */}
        {error && <ErrorAlert message={error} />}
        
        {/* 게시글 목록 */}
        {!isLoading && <BoardList posts={posts} />}
        
        {/* 페이지네이션 */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          onPageChange={setCurrentPage}
        />
      </div>
    </PageTransition>
  );
}

export default Board;