// src/pages/CookingGuide.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function CookingGuide() {
    const location = useLocation();
    const recipe = location.state?.recipe;
    const [currentStep, setCurrentStep] = useState(0);
    const [timer, setTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    // 타이머 시작 함수
    const startTimer = () => {
        if (recipe?.steps[currentStep].timer) {
            setTimeLeft(recipe.steps[currentStep].timer);
            setTimer('running');
        }
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
            alert('타이머가 완료되었습니다!');
        }
        return () => clearInterval(interval);
    }, [timer, timeLeft]);

    // 시간 포맷 함수
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* 진행 상태 바 */}
                <div className="progress-bar mb-6 bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${(currentStep / (recipe?.steps.length - 1)) * 100}%` }}
                    />
                </div>

                {/* 현재 단계 표시 */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Step {currentStep + 1}</h2>
                    <p className="text-lg mb-4">{recipe?.steps[currentStep].instruction}</p>
                    
                    {/* 타이머 섹션 */}
                    {recipe?.steps[currentStep].timer && (
                        <div className="mt-4">
                            {timer === null ? (
                                <button 
                                    onClick={startTimer}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    타이머 시작
                                </button>
                            ) : (
                                <div className="text-2xl font-mono">
                                    {formatTime(timeLeft)}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 이전/다음 버튼 */}
                <div className="flex justify-between">
                    <button 
                        onClick={() => {
                            setCurrentStep(prev => Math.max(0, prev - 1));
                            setTimer(null);
                        }}
                        disabled={currentStep === 0}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        이전
                    </button>
                    <button 
                        onClick={() => {
                            setCurrentStep(prev => Math.min(recipe?.steps.length - 1, prev + 1));
                            setTimer(null);
                        }}
                        disabled={currentStep === recipe?.steps.length - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CookingGuide;