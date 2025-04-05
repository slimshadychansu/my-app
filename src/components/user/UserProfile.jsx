import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/atoms';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    spicyLevel: user.preferences?.spicyLevel || '보통',
    cookingTime: user.preferences?.cookingTime || 30,
    vegetarian: user.preferences?.vegetarian || false,
    profileImage: user.profileImage || null
  });
  const [tempImage, setTempImage] = useState(user.profileImage || null);
  
  // 프로필 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 이미지 파일만 허용
    if (!file.type.match('image.*')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }
    
    // FileReader로 이미지를 Base64 문자열로 변환
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // 폼 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // 프로필 저장
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 사용자 상태 업데이트
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      profileImage: tempImage,
      preferences: {
        spicyLevel: formData.spicyLevel,
        cookingTime: parseInt(formData.cookingTime),
        vegetarian: formData.vegetarian
      }
    });
    
    setIsEditing(false);
    
    // 성공 메시지
    alert('프로필이 성공적으로 저장되었습니다!');
  };
  
  // 기본 이미지 설정
  const getDefaultProfileImage = () => {
    // 사용자 이름의 첫 글자를 이용한 아바타 생성
    const name = user.name || '사용자';
    const initial = name.charAt(0).toUpperCase();
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    
    return (
      <div 
        className="w-full h-full rounded-full flex items-center justify-center text-white text-4xl font-bold"
        style={{ backgroundColor: colors[colorIndex] }}
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">
        {isEditing ? '프로필 수정' : '내 프로필'}
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        {!isEditing ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 프로필 이미지 */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
              {user.profileImage ? (
                <img src={user.profileImage} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                getDefaultProfileImage()
              )}
            </div>
            
            {/* 프로필 정보 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold dark:text-white">{user.name || '이름을 설정해주세요'}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email || '이메일을 설정해주세요'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-sm text-gray-500 dark:text-gray-400">매운 음식 선호도</span>
                  <p className="font-medium dark:text-white">{user.preferences?.spicyLevel || '보통'}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-sm text-gray-500 dark:text-gray-400">선호 요리 시간</span>
                  <p className="font-medium dark:text-white">{user.preferences?.cookingTime || 30}분</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-sm text-gray-500 dark:text-gray-400">채식주의</span>
                  <p className="font-medium dark:text-white">{user.preferences?.vegetarian ? '예' : '아니오'}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                프로필 수정
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* 프로필 이미지 업로드 */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2 shadow-md">
                  {tempImage ? (
                    <img src={tempImage} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    getDefaultProfileImage()
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current.click()}
                    className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    이미지 선택
                  </button>
                  
                  {tempImage && (
                    <button 
                      type="button" 
                      onClick={() => setTempImage(null)}
                      className="text-sm bg-red-100 text-red-500 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
              
              {/* 프로필 정보 폼 */}
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">매운맛 선호도</label>
                  <select
                    name="spicyLevel"
                    value={formData.spicyLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="안매움">안매움</option>
                    <option value="약간">약간 매움</option>
                    <option value="보통">보통</option>
                    <option value="매움">매움</option>
                    <option value="아주매움">아주 매움</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    선호하는 요리 시간 (분)
                  </label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    min="5"
                    max="180"
                    step="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vegetarian"
                      checked={formData.vegetarian}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">채식주의자</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setTempImage(user.profileImage);
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    spicyLevel: user.preferences?.spicyLevel || '보통',
                    cookingTime: user.preferences?.cookingTime || 30,
                    vegetarian: user.preferences?.vegetarian || false
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                저장
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* 내 요리 취향 분석 및 추천 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">내 요리 취향 분석</h2>
        
        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              {user.name ? `${user.name}님은 ` : '당신은 '}
              {user.preferences?.spicyLevel === '안매움' ? '맵지 않은 음식을 좋아하고, ' : 
               user.preferences?.spicyLevel === '아주매움' ? '매운 음식을 즐기고, ' : 
               `${user.preferences?.spicyLevel || '보통'} 매운맛을 선호하고, `}
              
              {user.preferences?.vegetarian ? '채식 위주의 식단을 선호하며, ' : ''}
              
              {user.preferences?.cookingTime <= 15 ? '빠르게 조리할 수 있는 요리를 선호합니다.' : 
               user.preferences?.cookingTime >= 60 ? '시간을 들여 정성껏 만드는 요리를 즐깁니다.' : 
               `약 ${user.preferences?.cookingTime || 30}분 정도 소요되는 요리를 선호합니다.`}
            </p>
          </div>
        </div>
        
        <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-300">추천 요리</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-bold dark:text-white">{getRecommendedDish()}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">취향에 맞는 추천 요리</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-bold dark:text-white">{getRecommendedDish()}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">취향에 맞는 추천 요리</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-bold dark:text-white">{getRecommendedDish()}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">취향에 맞는 추천 요리</p>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            AI와 대화하며 요리 추천받기
          </button>
        </div>
      </div>
    </div>
  );
}

// 사용자 취향에 맞는 요리 추천 함수 (예시)
function getRecommendedDish() {
  const dishes = [
    '토마토 파스타', '버섯 리조또', '치킨 커리', '비빔밥', '샐러드 볼',
    '김치찌개', '된장찌개', '스테이크', '피자', '스크램블 에그',
    '감자탕', '냉면', '떡볶이', '부대찌개', '샌드위치'
  ];
  
  return dishes[Math.floor(Math.random() * dishes.length)];
}

export default UserProfile;