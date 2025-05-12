import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/animation/PageTransition';
import { FadeIn } from '../components/animation/FadeIn';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

// 새로 생성한 보드 관련 컴포넌트들
import BoardHeader from '../features/board/components/BoardHeader';
import CategoryFilter from '../features/board/components/CategoryFilter';
import TagFilter from '../features/board/components/TagFilter';
import SearchBar from '../features/board/components/SearchBar';
import BoardList from '../features/board/components/BoardList'
import Pagination from '../features/board/components/Pagination';

// 보드 데이터 훅
import { useBoardData } from '../features/board/hooks/useBoardData';

function Board() {
  const navigate = useNavigate();
  
  const { 
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
  } = useBoardData();

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4">
        <BoardHeader 
          title="커뮤니티" 
          onWriteClick={() => navigate('/board/write')} 
        />

        <FadeIn>
          <CategoryFilter 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />

          <TagFilter 
            popularTags={['한식', '간단요리', '다이어트', '살림꿀팁', '초보요리']}
            selectedTag={selectedTag} 
            onTagClick={setSelectedTag} 
          />
        </FadeIn>
        
        <SearchBar
          searchType={searchType}
          setSearchType={setSearchType}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          sortType={sortType}
          setSortType={setSortType}
          onSearch={(e) => {
            e.preventDefault();
            // 검색 로직 (현재는 useBoardData 훅에서 처리)
          }}
        />

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}

        <BoardList posts={posts} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </PageTransition>
  );
}

export default Board;