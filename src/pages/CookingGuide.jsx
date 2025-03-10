import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function CookingGuide() {
    const location = useLocation();
    const navigate = useNavigate();
    const recipe = location.state?.recipe;
    const [currentStep, setCurrentStep] = useState(0);
    const [timer, setTimer] = useState(null); // null, 'running', 'paused', 'finished'
    const [timeLeft, setTimeLeft] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const audioRef = useRef(null);
    
    const isLastStep = currentStep === recipe?.steps.length - 1;

    // 타이머 시작 함수
    const startTimer = () => {
        if (recipe?.steps[currentStep].timer) {
            setTimeLeft(recipe.steps[currentStep].timer);
            setTimer('running');
        }
    };

    // 타이머 일시정지/재개 토글
    const toggleTimer = () => {
        setTimer(prev => prev === 'running' ? 'paused' : 'running');
    };

    // 타이머 리셋
    const resetTimer = () => {
        setTimer(null);
        setTimeLeft(recipe?.steps[currentStep].timer || 0);
    };

    // 요리 완료 처리
    const completeRecipe = () => {
        setShowCompletionModal(true);
    };

    // 평가 페이지로 이동
    const goToRatePage = () => {
        // 레시피 정보 확인
        if (!recipe || !recipe.title) {
            alert("레시피 정보가 누락되었습니다. 홈으로 이동합니다.");
            navigate('/');
            return;
        }
        
        navigate('/favorites', { 
            state: { 
                rateRecipe: recipe 
            } 
        });
    };

    // 타이머 효과
    useEffect(() => {
        let interval;
        if (timer === 'running' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && timer === 'running') {
            setTimer('finished');
            setShowNotification(true);
            // Play sound
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
        }
        return () => clearInterval(interval);
    }, [timer, timeLeft]);

    // 시간 포맷 함수
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 타이머 진행률 계산
    const calculateProgress = () => {
        if (!recipe?.steps[currentStep].timer) return 0;
        const total = recipe.steps[currentStep].timer;
        const progress = total === 0 ? 0 : (total - timeLeft) / total * 100;
        return progress;
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {/* 진행 상태 바 */}
                <div className="mb-6 relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                진행률
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                                {Math.round((currentStep / (recipe?.steps.length - 1)) * 100)}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
                            style={{ width: `${(currentStep / (recipe?.steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* 현재 단계 표시 */}
                <div className="mb-8 bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full mr-3 font-bold">
                            {currentStep + 1}
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white">
                            {recipe?.title ? `${recipe.title} - ` : ''}Step {currentStep + 1}
                        </h2>
                    </div>
                    <p className="text-lg mb-6 dark:text-gray-200">{recipe?.steps[currentStep].instruction}</p>
                    
                    {/* 타이머 섹션 */}
                    {recipe?.steps[currentStep].timer > 0 && (
                        <div className="mt-6">
                            {timer === null ? (
                                <button 
                                    onClick={startTimer}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 shadow-md"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    타이머 시작 ({formatTime(recipe.steps[currentStep].timer)})
                                </button>
                            ) : (
                                <div className="flex flex-col items-center">
                                    {/* 원형 타이머 */}
                                    <div className="relative w-40 h-40 mb-4">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            {/* 배경 원 */}
                                            <circle 
                                                cx="50" cy="50" r="45" 
                                                fill="none" 
                                                stroke="#e5e7eb" 
                                                strokeWidth="8"
                                            />
                                            {/* 진행 원 */}
                                            <circle 
                                                cx="50" cy="50" r="45" 
                                                fill="none" 
                                                stroke="#3b82f6" 
                                                strokeWidth="8"
                                                strokeDasharray="283"
                                                strokeDashoffset={283 - (283 * calculateProgress() / 100)}
                                                transform="rotate(-90 50 50)"
                                                className="transition-all duration-1000 ease-linear"
                                            />
                                        </svg>
                                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                            <span className="text-3xl font-mono font-bold dark:text-white">
                                                {formatTime(timeLeft)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* 타이머 컨트롤 */}
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={toggleTimer}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm transition-colors
                                                ${timer === 'running' 
                                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                                }`}
                                        >
                                            {timer === 'running' ? (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    일시정지
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    재개
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            onClick={resetTimer}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                            </svg>
                                            리셋
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 알림 팝업 */}
                {showNotification && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 dark:text-white">타이머 완료!</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">다음 단계로 진행할 준비가 되었습니다.</p>
                                <button 
                                    onClick={() => setShowNotification(false)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 요리 완료 모달 */}
                {showCompletionModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 dark:text-white">요리 완료!</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    {recipe?.title} 요리가 완료되었습니다. 맛있게 드세요!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button 
                                        onClick={goToRatePage}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        요리 평가하기
                                    </button>
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        홈으로 돌아가기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 이전/다음/완료 버튼 */}
                <div className="flex justify-between mt-8">
                    <button 
                        onClick={() => {
                            setCurrentStep(prev => Math.max(0, prev - 1));
                            setTimer(null);
                            setShowNotification(false);
                        }}
                        disabled={currentStep === 0}
                        className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors
                            ${currentStep === 0 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        이전
                    </button>
                    
                    {isLastStep ? (
                        <button 
                            onClick={completeRecipe}
                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            요리 완료
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                setCurrentStep(prev => Math.min(recipe?.steps.length - 1, prev + 1));
                                setTimer(null);
                                setShowNotification(false);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            다음
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    )}
                </div>
                
                {/* 오디오 요소 */}
                <audio ref={audioRef}>
                    <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
}

export default CookingGuide;