import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate, useLocation } from 'react-router-dom';
import { favoritesState, userState, reviewsState } from '../store/atoms';

function Favorites() {
  const location = useLocation();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const [reviews, setReviews] = useRecoilState(reviewsState);
  const user = useRecoilValue(userState);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // 자동으로 평가 모달 열기 (요리 완료 후)
  useEffect(() => {
    const handleIncomingRateRequest = () => {
      if (location.state?.rateRecipe) {
        const recipeToRate = location.state.rateRecipe;
        
        // 로그인 상태 확인
        if (!user.isLoggedIn || !user.id) {
          setShowLoginPrompt(true);
          return;
        }
        
        // 즐겨찾기에 있는지 확인
        const favoriteRecipe = favorites.find(item => item.title === recipeToRate.title);
        
        if (favoriteRecipe) {
          openRatingModal(favoriteRecipe);
        } else {
          // 즐겨찾기에 없으면 추가
          const newRecipe = { ...recipeToRate };
          setFavorites(prev => [...prev, newRecipe]);
          
          // 다음 렌더 사이클에서 모달 열기위해 setTimeout 사용
          setTimeout(() => {
            openRatingModal(newRecipe);
          }, 0);
        }
        
        // 히스토리에서 state 제거 (새로고침 시 모달이 다시 뜨는 것 방지)
        window.history.replaceState({}, document.title);
      }
    };
    
    handleIncomingRateRequest();
  }, [location.state, favorites, user]);

  // 요리 시작하기
  const startCooking = (recipe) => {
    navigate('/guide', { state: { recipe } });
  };

  // 즐겨찾기 삭제
  const removeFavorite = (title) => {
    setFavorites(prev => prev.filter(item => item.title !== title));
  };

  // 평가 모달 열기
  const openRatingModal = (recipe) => {
    // 로그인 상태 확인
    if (!user.isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    setCurrentRecipe(recipe);
    const userReview = reviews.find(
      review => review.recipeTitle === recipe.title && review.userId === user.id
    );
    
    if (userReview) {
      setRating(userReview.rating || 0);
      setComment(userReview.comment || '');
      setIsPublic(userReview.isPublic !== false); // 기본값은 true
    } else {
      setRating(0);
      setComment('');
      setIsPublic(true);
    }
    
    setShowRatingModal(true);
  };

  // 평가 저장
  const saveRating = () => {
    if (!user.isLoggedIn || !currentRecipe) return;
    
    // 리뷰 저장 (공유 리뷰)
    const reviewData = {
      id: `${user.id || 'user'}-${currentRecipe.title}-${Date.now()}`,
      userId: user.id || 'anonymous',
      userName: user.name || '익명',
      recipeTitle: currentRecipe.title,
      rating,
      comment,
      isPublic,
      createdAt: new Date().toISOString()
    };
    
    // 기존 리뷰가 있는지 확인
    const existingReviewIndex = reviews.findIndex(
      review => review.recipeTitle === currentRecipe.title && review.userId === (user.id || 'anonymous')
    );
    
    if (existingReviewIndex !== -1) {
      // 기존 리뷰 업데이트
      const updatedReviews = [...reviews];
      updatedReviews[existingReviewIndex] = {
        ...updatedReviews[existingReviewIndex],
        rating,
        comment,
        isPublic,
        updatedAt: new Date().toISOString()
      };
      setReviews(updatedReviews);
    } else {
      // 새 리뷰 추가
      setReviews(prev => [...prev, reviewData]);
    }
    
    // 즐겨찾기 항목에도 평가 정보 추가
    setFavorites(prev => 
      prev.map(item => 
        item.title === currentRecipe.title
          ? { 
              ...item, 
              rating, 
              comment, 
              ratedAt: new Date().toISOString(),
              isPublicReview: isPublic
            }
          : item
      )
    );
    
    // 모달 닫기 - setTimeout으로 상태 업데이트 후 닫히도록 보장
    setTimeout(() => {
      setShowRatingModal(false);
      setCurrentRecipe(null);
    }, 100);
  };

  // 평가 시간 포맷
  const formatRatedAt = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 레시피에 대한 모든 공개 리뷰 가져오기
  const getPublicReviews = (recipeTitle) => {
    return reviews.filter(
      review => review.recipeTitle === recipeTitle && review.isPublic === true
    );
  };

  // 평균 평점 계산
  const getAverageRating = (recipeTitle) => {
    const publicReviews = getPublicReviews(recipeTitle);
    if (publicReviews.length === 0) return 0;
    
    const sum = publicReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / publicReviews.length).toFixed(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">
        나의 즐겨찾기 레시피
      </h1>

      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            아직 즐겨찾기한 레시피가 없습니다.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            레시피 찾아보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((recipe, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold mb-2 dark:text-white">{recipe.title}</h2>
                  {recipe.rating && (
                    <div className="flex items-center">
                      <div className="flex mr-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            {i < recipe.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      {recipe.isPublicReview && (
                        <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">공개</span>
                      )}
                    </div>
                  )}
                </div>

                {recipe.ratedAt && (
                  <div className="mb-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{recipe.comment}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatRatedAt(recipe.ratedAt)}에 평가함
                      </p>
                    </div>
                  </div>
                )}

                {/* 공개 리뷰 수와 평균 평점 표시 */}
                <div className="mb-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      평균 평점: {getAverageRating(recipe.title)} 
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      리뷰 {getPublicReviews(recipe.title).length}개
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <div className="space-x-2">
                    <button
                      onClick={() => startCooking(recipe)}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      요리하기
                    </button>
                    <button
                      onClick={() => openRatingModal(recipe)}
                      className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition-colors"
                    >
                      {recipe.rating ? '평가 수정' : '평가하기'}
                    </button>
                  </div>
                  <button
                    onClick={() => removeFavorite(recipe.title)}
                    className="text-red-500 hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
              
              {/* 공개 리뷰 목록 */}
              {getPublicReviews(recipe.title).length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold mb-2 dark:text-white">다른 사용자 리뷰</h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {getPublicReviews(recipe.title)
                      .filter(review => review.userId !== (user.id || 'anonymous')) // 자신의 리뷰 제외
                      .slice(0, 3) // 최대 3개만 표시
                      .map(review => (
                        <div key={review.id} className="text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium dark:text-white">{review.userName}</span>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xs">
                                  {i < review.rating ? '★' : '☆'}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatRatedAt(review.createdAt)}</p>
                        </div>
                      ))
                    }
                    {getPublicReviews(recipe.title).length > 3 && (
                      <button 
                        className="text-blue-500 text-xs font-medium hover:underline"
                        onClick={() => navigate(`/reviews/${encodeURIComponent(recipe.title)}`)}
                      >
                        모든 리뷰 보기 ({getPublicReviews(recipe.title).length})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 평가 모달 */}
      {showRatingModal && currentRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {currentRecipe.title} 평가하기
            </h2>
            
            {/* 별점 선택 */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">별점</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 코멘트 입력 */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">코멘트</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="요리에 대한 평가를 남겨주세요"
                rows={3}
              />
            </div>
            
            {/* 공개 설정 */}
            <div className="mb-4">
              <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  className="mr-2"
                />
                이 평가를 다른 사용자들에게 공개합니다
              </label>
            </div>
            
            {/* 버튼 */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setCurrentRecipe(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={saveRating}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 로그인 프롬프트 모달 */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">로그인 필요</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              요리 평가 기능을 사용하려면 로그인이 필요합니다.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/login');
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                로그인하기
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/signup');
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;