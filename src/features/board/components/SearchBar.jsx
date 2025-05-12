import React from 'react';
import Button from '../../../components/common/Button';

const SearchBar = ({ 
  searchType, 
  setSearchType, 
  searchKeyword, 
  setSearchKeyword, 
  sortType, 
  setSortType, 
  onSearch 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
      <div className="flex-shrink-0">
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="latest">최신순</option>
          <option value="views">조회순</option>
          <option value="comments">댓글순</option>
          <option value="likes">좋아요순</option>
        </select>
      </div>
      
      <form onSubmit={onSearch} className="flex flex-1 gap-2">
        <select 
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="author">작성자</option>
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
  );
};

export default SearchBar;