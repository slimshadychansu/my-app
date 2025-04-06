// src/features/board/hooks/useBoardForm.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, updatePost } from '../api/boardApi';

export function useBoardForm(initialData = {}, postId = null) {
  const navigate = useNavigate();
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    category: initialData.category || 'recipe',
    tags: initialData.tags || [],
    images: initialData.images || [],
    recipeDetails: initialData.recipeDetails || {
      cookingTime: 30,
      difficulty: '보통',
      ingredients: [{ name: '', amount: '' }]
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 일반 입력 필드 변경 핸들러
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((category) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  }, []);

  // 태그 변경 핸들러
  const handleTagsChange = useCallback((tags) => {
    setFormData(prev => ({
      ...prev,
      tags
    }));
  }, []);

  // 이미지 변경 핸들러
  const handleImagesChange = useCallback((images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  }, []);

  // 요리 시간 변경 핸들러
  const handleCookingTimeChange = useCallback((cookingTime) => {
    setFormData(prev => ({
      ...prev,
      recipeDetails: {
        ...prev.recipeDetails,
        cookingTime
      }
    }));
  }, []);

  // 난이도 변경 핸들러
  const handleDifficultyChange = useCallback((difficulty) => {
    setFormData(prev => ({
      ...prev,
      recipeDetails: {
        ...prev.recipeDetails,
        difficulty
      }
    }));
  }, []);

  // 재료 정보 변경 핸들러
  const handleIngredientChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const updatedIngredients = [...prev.recipeDetails.ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value
      };
      
      return {
        ...prev,
        recipeDetails: {
          ...prev.recipeDetails,
          ingredients: updatedIngredients
        }
      };
    });
  }, []);

  // 재료 추가 핸들러
  const handleAddIngredient = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      recipeDetails: {
        ...prev.recipeDetails,
        ingredients: [...prev.recipeDetails.ingredients, { name: '', amount: '' }]
      }
    }));
  }, []);

  // 재료 삭제 핸들러
  const handleRemoveIngredient = useCallback((index) => {
    setFormData(prev => {
      // 적어도 하나의 재료는 유지
      if (prev.recipeDetails.ingredients.length <= 1) {
        return prev;
      }
      
      return {
        ...prev,
        recipeDetails: {
          ...prev.recipeDetails,
          ingredients: prev.recipeDetails.ingredients.filter((_, i) => i !== index)
        }
      };
    });
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 폼 데이터 유효성 검사
      if (!formData.title.trim()) {
        throw new Error('제목을 입력해주세요.');
      }
      
      if (!formData.content.trim()) {
        throw new Error('내용을 입력해주세요.');
      }
      
      // 카테고리가 레시피인 경우 추가 검증
      if (formData.category === 'recipe') {
        const { ingredients } = formData.recipeDetails;
        const hasEmptyIngredient = ingredients.some(ing => !ing.name.trim());
        
        if (hasEmptyIngredient) {
          throw new Error('모든 재료 이름을 입력해주세요.');
        }
      }
      
      // 이미지 파일이 있는 경우 FormData 객체로 변환
      let postData;
      
      if (formData.images && formData.images.length > 0) {
        postData = new FormData();
        postData.append('title', formData.title);
        postData.append('content', formData.content);
        postData.append('category', formData.category);
        
        // 태그 배열을 JSON 문자열로 변환
        postData.append('tags', JSON.stringify(formData.tags));
        
        // 카테고리가 레시피인 경우 레시피 상세 정보 추가
        if (formData.category === 'recipe') {
          postData.append('recipeDetails', JSON.stringify(formData.recipeDetails));
        }
        
        // 이미지 파일 추가
        formData.images.forEach((image, index) => {
          postData.append(`images`, image);
        });
      } else {
        // 이미지가 없는 경우 일반 객체로 전송
        postData = {
          ...formData,
          // 필요한 경우 데이터 형식 변환 작업
        };
      }
      
      let response;
      
      if (postId) {
        // 게시글 수정
        response = await updatePost(postId, postData);
      } else {
        // 게시글 생성
        response = await createPost(postData);
      }
      
      // 성공 시 게시글 상세 페이지로 이동
      navigate(`/board/${response.data.id || postId}`);
    } catch (err) {
      console.error('게시글 저장 중 오류 발생:', err);
      
      // 오류 메시지 설정
      setError(err.response?.data?.message || err.message || '게시글을 저장하는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, postId, navigate]);

  return {
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
  };
}