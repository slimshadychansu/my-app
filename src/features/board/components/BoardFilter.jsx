// src/features/board/components/BoardFilter.jsx
const BoardFilter = React.memo(({ 
    activeCategory, 
    onCategoryChange, 
    popularTags, 
    onTagClick 
  }) => {
    return (
      <>
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={onCategoryChange} 
        />
        <TagFilter 
          popularTags={popularTags} 
          onTagClick={onTagClick} 
        />
      </>
    );
  });