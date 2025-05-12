// src/components/timer/TimerNotification.jsx
import React, { memo, useEffect } from 'react'; // useEffect 추가
import PropTypes from 'prop-types';
import speechUtils from '../../utils/chromeSpeechUtils';

const TimerNotification = memo(function TimerNotification({ isOpen, onClose }) {
  useEffect(() => {
    // 알림이 표시될 때 음성으로 알려주기
    if (isOpen && speechUtils.checkSupport().tts) {
      speechUtils.speak("타이머가 완료되었습니다. 다음 단계로 진행해주세요.", {
        rate: 1,
        volume: 1
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">시간이 완료되었습니다!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            다음 단계로 진행해주세요.
          </p>
          <button 
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
});

TimerNotification.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TimerNotification;