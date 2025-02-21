import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { userState } from '../../store/atoms'

function UserProfile() {
  const [user, setUser] = useRecoilState(userState)

  // 이름 변경을 처리하는 함수
  const handleNameChange = (e) => {
    setUser(prev => ({
      ...prev,
      name: e.target.value
    }))
  }

  // 선호도 변경을 처리하는 함수
  const handlePreferenceChange = (key, value) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6">프로필 설정</h2>
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6 space-y-6">
        {/* 프로필 기본 정보 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700">이름</label>
            <input
              type="text"
              value={user.name}
              onChange={handleNameChange}
              className="mt-1 w-full px-3 py-2 md:py-3 border rounded-lg"
              placeholder="이름을 입력하세요"
            />
          </div>
        </div>

        {/* 선호도 설정 */}
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">요리 선호도 설정</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm md:text-base font-medium">매운맛 정도</label>
              <select
                value={user.preferences.spicyLevel}
                onChange={(e) => handlePreferenceChange('spicyLevel', e.target.value)}
                className="mt-1 w-full px-3 py-2 md:py-3 border rounded-lg"
              >
                <option value="순한맛">순한맛</option>
                <option value="보통">보통</option>
                <option value="매운맛">매운맛</option>
              </select>
            </div>

            <div>
              <label className="block text-sm md:text-base font-medium">선호하는 조리 시간</label>
              <select
                value={user.preferences.cookingTime}
                onChange={(e) => handlePreferenceChange('cookingTime', Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 md:py-3 border rounded-lg"
              >
                <option value={15}>15분 이내</option>
                <option value={30}>30분 이내</option>
                <option value={60}>1시간 이내</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={user.preferences.vegetarian}
              onChange={(e) => handlePreferenceChange('vegetarian', e.target.checked)}
              className="h-4 w-4 md:h-5 md:w-5 text-blue-600"
            />
            <label className="ml-2 text-sm md:text-base">채식 선호</label>
          </div>
        </div>
      </div>
    </div>
  )
}

// 컴포넌트를 내보내는 export default 문을 추가합니다
export default UserProfile