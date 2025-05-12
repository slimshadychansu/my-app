import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { reviewsState } from '../store/atoms';

function ReviewList() {
  const { recipeTitle } = useParams();
  const reviews = useRecoilValue(reviewsState);
  const navigate = useNavigate();
  
  // 디코딩된 레시피 제목
  const decodedTitle = decodeURIComponent(recipeTitle);
  
  // 해당 레시피의, 공개로 설정된 리뷰만 필터링
  const publicReviews = reviews.filter(
    review => review.recipeTitle === decodedTitle && review.isPublic === true
  );
  
  // 평가 시간 포맷
  const formatRatedAt = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 평균 평점 계산
  const calculateAverageRating = () => {
    if (publicReviews.length === 0) return 0;
    const sum = publicReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / publicReviews.length).toFixed(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-2">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <h1 className="text-2xl font-bold dark:text-white">{decodedTitle} 리뷰</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="text-4xl font-bold text-yellow-500 mr-2">{calculateAverageRating()}</div>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl">
                  {i < Math.round(calculateAverageRating()) ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            총 {publicReviews.length}개의 리뷰
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {publicReviews.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            아직 리뷰가 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {publicReviews.map(review => (
              <div key={review.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium dark:text-white">{review.userName || '익명'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {formatRatedAt(review.createdAt)}
                    </span>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewList;