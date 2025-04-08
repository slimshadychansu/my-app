import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';
import { FadeIn } from '../components/animation/FadeIn';
import Button from '../components/common/Button';

// 분리된 컴포넌트 및 훅 임포트
import CategorySelector from '../features/board/components/CategorySelector';
import TagInput from '../features/board/components/TagInput';
import ImageUploader from '../features/board/components/ImageUploader';
import RecipeDetailsForm from '../features/board/components/RecipeDetailsForm';
import { useBoardForm } from '../features/board/hooks/useBoardForm';
import { useImageUpload } from '../features/board/hooks/useImageUpload';

function BoardWrite() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  
  // 게시글 폼 훅 사용
  const {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleTagsChange,
    handleImagesChange,
    handleCategoryChange,
    handleCookingTimeChange,
    handleDifficultyChange,
    handleIngredientChange,
    handleAddIngredient,
    handleRemoveIngredient,
    handleSubmit
  } = useBoardForm();
  
  // 이미지 업로드 훅 사용
  const {
    previewUrls,
    isDragging,
    errors: imageErrors,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage
  } = useImageUpload(formData.images, handleImagesChange);
  
  // 사용자 로그인 체크
  const checkUserLogin = () => {
    if (!user.isLoggedIn) {
      alert('로그인 후 이용해주세요');
      navigate('/login');
      return false;
    }
    return true;
  };

  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">게시글 작성</h1>

        {/* 오류 메시지 표시 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={(e) => {
          if (!checkUserLogin()) return;
          handleSubmit(e);
        }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* 카테고리 선택 */}
          <CategorySelector
            selectedCategory={formData.category}
            onCategoryChange={handleCategoryChange}
          />

          {/* 제목 입력 */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold dark:text-white">제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          
          {/* 레시피 카테고리 선택 시 추가 정보 */}
          {formData.category === 'recipe' && (
            <RecipeDetailsForm
              recipeDetails={formData.recipeDetails}
              onCookingTimeChange={handleCookingTimeChange}
              onDifficultyChange={handleDifficultyChange}
              onIngredientChange={handleIngredientChange}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
            />
          )}

          {/* 내용 입력 */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold dark:text-white">내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg h-64 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={formData.category === 'recipe' 
                ? "레시피 순서와 팁을 상세히 설명해주세요" 
                : "내용을 입력하세요"}
              required
            />
          </div>
          
          {/* 태그 입력 */}
          <TagInput
            tags={formData.tags}
            onTagsChange={handleTagsChange}
            maxTags={5}
          />
          
          {/* 이미지 업로드 */}
          <ImageUploader
            previewUrls={previewUrls}
            isDragging={isDragging}
            errors={imageErrors}
            onFileSelect={handleFileSelect}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemoveImage={removeImage}
            maxImageCount={5}
          />

          {/* 버튼 그룹 */}
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/board')}
              type="button"
            >
              취소
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '작성하기'}
            </Button>
          </div>
        </form>
      </div>
    </FadeIn>
  );
}

export default BoardWrite;