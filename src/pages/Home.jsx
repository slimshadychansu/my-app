import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil'
import { userState, favoritesState } from '../store/atoms'

function Home() {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)
  const [favorites, setFavorites] = useRecoilState(favoritesState)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const [animatingFavorite, setAnimatingFavorite] = useState(null)
  const audioRef = useRef(null)
  
  // 음성 인식 관련 상태
  const [isListening, setIsListening] = useState(false)
  const [speechRecognition, setSpeechRecognition] = useState(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  
  // 요리 가이드 관련 상태
  const [showCookingGuide, setShowCookingGuide] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [timer, setTimer] = useState(null) // null, 'running', 'paused', 'finished'
  const [timeLeft, setTimeLeft] = useState(0)
  const [showTimerNotification, setShowTimerNotification] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  
  const [quickSuggestions] = useState([
    "간단한 저녁 메뉴 추천해줘",
    "파스타 요리법 알려줘",
    "건강한 샐러드 레시피 알려줘",
    "남은 계란으로 만들 수 있는 요리는?",
    "요리 초보를 위한 팁"
  ])
  
  // 요리 중 관련 빠른 제안
  const [cookingSuggestions] = useState([
    "이 재료 대체할 수 있을까?",
    "다음 단계 미리 준비할게 있어?",
    "소금은 얼마나 넣어야 해?",
    "이 요리에 어울리는 음료는?",
    "요리 보관 방법 알려줘"
  ])

  // Web Speech API 지원 확인 및 초기화
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR'; // 한국어 설정
      
      // 음성 인식 결과 처리
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
        
        // 음성 인식이 끝나면 자동 제출
        if (event.results[0].isFinal) {
          setTimeout(() => {
            setIsListening(false);
            handleVoiceSubmit(transcript);
          }, 500);
        }
      };
      
      // 오류 처리
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      // 음성 인식 종료 처리
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setSpeechRecognition(recognition);
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
    }
  }, []);
  
  // 음성 인식 시작
  const startListening = () => {
    if (speechRecognition && !isListening && !isLoading) {
      speechRecognition.start();
      setIsListening(true);
    }
  };
  
  // 음성 인식 종료
  const stopListening = () => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
      setIsListening(false);
    }
  };
  
  // 음성 인식 토글
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // 음성 인식 결과로 메시지 제출
  const handleVoiceSubmit = (transcript) => {
    if (transcript && transcript.trim() !== '') {
      setInput(transcript);
      handleSubmit(null, transcript);
    }
  };

  // 초기 메시지 설정 (사용자 취향 반영)
  useEffect(() => {
    let initialMessage = {
      type: 'ai',
      content: '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?',
      suggestion: '예시: "간단한 저녁 메뉴 추천해줘" 또는 "남은 재료로 만들 수 있는 요리 알려줘"'
    };

    // 사용자 정보가 있는 경우 맞춤형 메시지 표시
    if (user.name) {
      let personalizedSuggestion = '';
      
      // 조리 시간 기반 제안
      if (user.preferences?.cookingTime <= 15) {
        personalizedSuggestion = `${user.name}님은 빠른 요리를 선호하시네요. "15분 안에 만들 수 있는 요리 추천해줘"라고 물어보세요.`;
      } else if (user.preferences?.cookingTime >= 60) {
        personalizedSuggestion = `${user.name}님은 정성 들인 요리를 좋아하시네요. "주말에 만들기 좋은 특별한 요리 추천해줘"라고 물어보세요.`;
      }
      
      // 매운맛 선호도 반영
      if (user.preferences?.spicyLevel === '아주매움') {
        personalizedSuggestion = `${user.name}님은 매운 음식을 좋아하시네요. "매운 요리 추천해줘"라고 물어보세요.`;
      } else if (user.preferences?.spicyLevel === '안매움') {
        personalizedSuggestion = `${user.name}님은 맵지 않은 음식을 선호하시네요. "순한 맛 요리 추천해줘"라고 물어보세요.`;
      }
      
      // 채식주의 반영
      if (user.preferences?.vegetarian) {
        personalizedSuggestion = `${user.name}님은 채식을 선호하시네요. "채식 요리 추천해줘"라고 물어보세요.`;
      }
      
      initialMessage = {
        type: 'ai',
        content: `안녕하세요, ${user.name}님! 오늘은 어떤 요리를 도와드릴까요?`,
        suggestion: personalizedSuggestion || '예시: "간단한 저녁 메뉴 추천해줘" 또는 "내 취향에 맞는 요리 추천해줘"'
      };
    }
    
    setMessages([initialMessage]);
  }, [user]);

  // 채팅 스크롤 자동화
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 요리 가이드 시작
  const startCookingGuide = (recipe) => {
    setCurrentRecipe(recipe);
    setCurrentStep(0);
    setTimer(null);
    setTimeLeft(0);
    setShowCookingGuide(true);
    
    // 요리 시작 메시지 추가
    setMessages(prev => [...prev, {
      type: 'ai',
      content: `"${recipe.title}" 요리를 시작합니다! 요리하면서 궁금한 점이 있으면 언제든지 물어보세요.`,
      suggestion: '타이머를 사용하면서도 질문할 수 있어요!'
    }]);
  };
  
  // 요리 가이드 종료
  const closeCookingGuide = () => {
    // 타이머가 실행중이면 확인
    if (timer === 'running') {
      if (!window.confirm('요리 타이머가 실행 중입니다. 정말 종료하시겠습니까?')) {
        return;
      }
    }
    
    setShowCookingGuide(false);
    setTimer(null);
    setShowTimerNotification(false);
    setShowCompletionModal(false);
    
    // 요리 종료 메시지 추가
    if (currentRecipe) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: `"${currentRecipe.title}" 요리 가이드를 종료했습니다. 다른 도움이 필요하신가요?`
      }]);
    }
  };
  
  // 타이머 시작 함수
  const startTimer = () => {
    if (currentRecipe?.steps[currentStep].timer) {
      setTimeLeft(currentRecipe.steps[currentStep].timer);
      setTimer('running');
      
      // 타이머 시작 메시지 추가 (채팅을 지나치게 많이 하지 않기 위해 주석 처리)
      // setMessages(prev => [...prev, {
      //   type: 'ai',
      //   content: `${formatTime(currentRecipe.steps[currentStep].timer)} 타이머를 시작했습니다. 타이머가 실행 중에도 자유롭게 질문하세요!`
      // }]);
    }
  };

  // 타이머 일시정지/재개 토글
  const toggleTimer = () => {
    setTimer(prev => prev === 'running' ? 'paused' : 'running');
  };

  // 타이머 리셋
  const resetTimer = () => {
    setTimer(null);
    setTimeLeft(currentRecipe?.steps[currentStep].timer || 0);
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
      setShowTimerNotification(true);
      // Play sound
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      
      // 타이머 완료 메시지 추가
      setMessages(prev => [...prev, {
        type: 'ai',
        content: `타이머가 완료되었습니다! 다음 단계로 진행할 준비가 되었습니다.`
      }]);
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
    if (!currentRecipe?.steps[currentStep].timer) return 0;
    const total = currentRecipe.steps[currentStep].timer;
    const progress = total === 0 ? 0 : (total - timeLeft) / total * 100;
    return progress;
  };
  
  // 요리 완료 처리
  const completeRecipe = () => {
    setShowCompletionModal(true);
    
    // 요리 완료 메시지 추가
    setMessages(prev => [...prev, {
      type: 'ai',
      content: `${currentRecipe.title} 요리가 완료되었습니다! 맛있게 드세요!`,
      suggestion: '평가를 남기시면 다른 사용자들에게 도움이 됩니다.'
    }]);
  };
  
  // 평가 페이지로 이동
  const goToRatePage = () => {
    if (!currentRecipe || !currentRecipe.title) {
      alert("레시피 정보가 누락되었습니다. 홈으로 이동합니다.");
      closeCookingGuide();
      return;
    }
    
    navigate('/favorites', { 
      state: { 
        rateRecipe: currentRecipe 
      } 
    });
  };

  const toggleFavorite = (recipe) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.title === recipe.title)
      
      // 즐겨찾기 추가/제거 시 애니메이션 효과 트리거
      setAnimatingFavorite(recipe.title);
      setTimeout(() => setAnimatingFavorite(null), 800);
      
      if (exists) {
        return prev.filter(item => item.title !== recipe.title)
      }
      return [...prev, recipe]
    })
  }

  // 사용자 취향에 맞는 레시피 추천
  const getPersonalizedRecipes = () => {
    // 다양한 레시피 데이터베이스 (예시)
    const recipeDatabase = [
      {
        title: '토마토 파스타',
        cookingTime: 20,
        spicyLevel: '약간',
        vegetarian: true,
        steps: [
          { instruction: '물을 끓인 후 소금을 넣고 파스타를 삶습니다', timer: 600 },
          { instruction: '팬에 올리브 오일을 두르고 다진 마늘을 볶습니다', timer: 120 },
          { instruction: '토마토 소스를 붓고 끓여줍니다', timer: 300 },
          { instruction: '삶은 파스타와 소스를 섞고 소금, 후추로 간을 합니다', timer: 60 }
        ]
      },
      {
        title: '매운 닭갈비',
        cookingTime: 40,
        spicyLevel: '매움',
        vegetarian: false,
        steps: [
          { instruction: '닭을 손질하고 양념합니다', timer: 0 },
          { instruction: '양념한 닭을 중불에서 조리합니다', timer: 600 },
          { instruction: '야채를 넣고 같이 조리합니다', timer: 300 }
        ]
      },
      {
        title: '두부 스테이크',
        cookingTime: 15,
        spicyLevel: '안매움',
        vegetarian: true,
        steps: [
          { instruction: '두부를 1.5cm 두께로 자르고 소금과 후추로 밑간합니다', timer: 0 },
          { instruction: '팬에 올리브 오일을 두르고 중간 불로 가열합니다', timer: 120 },
          { instruction: '두부를 넣고 앞뒤로 노릇하게 구워줍니다', timer: 300 }
        ]
      },
      {
        title: '김치 볶음밥',
        cookingTime: 15,
        spicyLevel: '보통',
        vegetarian: false,
        steps: [
          { instruction: '김치를 먹기 좋은 크기로 자릅니다', timer: 0 },
          { instruction: '팬에 김치를 볶다가 밥을 넣고 함께 볶습니다', timer: 300 },
          { instruction: '기호에 따라 참기름을 두릅니다', timer: 60 }
        ]
      },
      {
        title: '샐러드 볼',
        cookingTime: 10,
        spicyLevel: '안매움',
        vegetarian: true,
        steps: [
          { instruction: '야채를 씻고 먹기 좋은 크기로 자릅니다', timer: 0 },
          { instruction: '드레싱 재료를 섞습니다', timer: 120 },
          { instruction: '야채와 드레싱을 함께 섞습니다', timer: 60 }
        ]
      }
    ];
    
    // 사용자 취향에 맞게 필터링
    let filteredRecipes = [...recipeDatabase];
    
    // 채식 필터링
    if (user.preferences?.vegetarian) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.vegetarian);
    }
    
    // 매운맛 필터링
    if (user.preferences?.spicyLevel === '안매움') {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.spicyLevel === '안매움');
    } else if (user.preferences?.spicyLevel === '아주매움') {
      filteredRecipes = filteredRecipes.filter(recipe => ['매움', '아주매움'].includes(recipe.spicyLevel));
    }
    
    // 조리 시간 필터링
    if (user.preferences?.cookingTime <= 15) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.cookingTime <= 20);
    } else if (user.preferences?.cookingTime >= 60) {
      // 시간이 오래 걸리는 요리를 원한다면 이런 필터링 로직을 추가할 수 있음
    }
    
    // 추천할 레시피가 없으면 기본 레시피 반환
    if (filteredRecipes.length === 0) {
      return [recipeDatabase[2]]; // 두부 스테이크는 무난한 선택
    }
    
    // 취향에 맞는 레시피 중 무작위로 선택 (최대 2개)
    const shuffled = filteredRecipes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(2, shuffled.length));
  };

  // 요리 중 질문에 대한 응답 생성 (간단한 예시)
  const getCookingRelatedAnswer = (question) => {
    // 요리 중 자주 묻는 질문에 대한 답변
    if (question.includes('대체') || question.includes('재료')) {
      return `일반적으로 ${currentRecipe.title}에서 재료를 대체할 때는 비슷한 식감과 맛을 가진 것을 선택하는 것이 좋습니다. 구체적으로 어떤 재료를 대체하고 싶으신가요?`;
    }
    else if (question.includes('소금') || question.includes('간')) {
      return `${currentRecipe.title}에는 전체 재료의 1~2% 정도의 소금이 적당합니다. 조금씩 넣어가며 맛을 보는 것이 좋아요.`;
    }
    else if (question.includes('보관') || question.includes('저장')) {
      return `${currentRecipe.title}는 완전히 식힌 후 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 맛있게 드실 수 있습니다.`;
    }
    else if (question.includes('음료') || question.includes('와인') || question.includes('맥주')) {
      return `${currentRecipe.title}와 잘 어울리는 음료로는 ${currentRecipe.title.includes('파스타') ? '드라이한 화이트 와인' : currentRecipe.title.includes('매운') ? '라거 맥주' : '탄산수나 에이드류'}가 좋습니다.`;
    }
    else {
      return `요리 중에 도움이 필요하시군요! ${currentRecipe.title} 요리에 대해 더 구체적인 질문이 있으시면 알려주세요.`;
    }
  };

  const handleSubmit = async (e, voiceInput = null) => {
    e?.preventDefault();
    
    const submitInput = voiceInput || input;
    if (!submitInput.trim() || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', content: submitInput }]);
    setIsLoading(true);

    // 타이머 설정 (시뮬레이션)
    setTimeout(() => {
      // 요리 가이드 모드에서의 질문이라면 요리 관련 응답
      if (showCookingGuide && currentRecipe) {
        const cookingResponse = getCookingRelatedAnswer(submitInput);
        setMessages(prev => [...prev, {
          type: 'ai',
          content: cookingResponse
        }]);
      }
      // 일반 모드에서의 질문 처리
      else if (submitInput.includes('추천') || submitInput.includes('뭐') || submitInput.includes('먹을') || submitInput.includes('취향')) {
        const recommendedRecipes = getPersonalizedRecipes();
        
        // 추천 응답 생성
        const recipeCards = (
          <div>
            <p>
              {user.name ? `${user.name}님의 취향에 맞는` : '오늘 추천드리는'} 요리입니다!
              {user.preferences?.vegetarian ? ' (채식 옵션)' : ''}
              {user.preferences?.spicyLevel !== '보통' ? ` (${user.preferences?.spicyLevel} 맛)` : ''}
            </p>
            
            <div className="grid grid-cols-1 gap-3 mt-3">
              {recommendedRecipes.map((recipe, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{recipe.title}</h3>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 px-2 py-0.5 rounded-full">
                      {recipe.cookingTime}분
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => startCookingGuide(recipe)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm shadow-sm"
                    >
                      요리 시작하기
                    </button>
                    <button 
                      onClick={() => toggleFavorite(recipe)}
                      className="flex items-center gap-1 px-3 py-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300 text-sm"
                    >
                      <span 
                        className={`text-xl transition-all duration-300 transform ${
                          animatingFavorite === recipe.title ? 'scale-150' : ''
                        } ${
                          favorites.find(item => item.title === recipe.title) 
                            ? 'text-yellow-400 drop-shadow-md' 
                            : 'text-gray-400'
                        }`}
                      >
                        {favorites.find(item => item.title === recipe.title) 
                          ? '★' 
                          : '☆'}
                      </span>
                      <span>즐겨찾기</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
        setMessages(prev => [...prev, {
          type: 'ai',
          content: recipeCards,
          suggestion: '다른 종류의 요리를 원하시면 "다른 요리 추천해줘"라고 말씀해주세요.'
        }]);
      } else if (submitInput.includes('레시피') || submitInput.includes('만드는') || submitInput.includes('요리법')) {
        // 레시피 응답 로직 - 채팅 내 요리 가이드 통합
        // 예: 파스타 키워드 감지
        if (submitInput.toLowerCase().includes('파스타')) {
          const pastaRecipe = {
            title: '간단한 토마토 파스타',
            cookingTime: 20,
            steps: [
              { instruction: '물을 끓인 후 소금을 넣고 파스타를 삶습니다', timer: 600 },
              { instruction: '팬에 올리브 오일을 두르고 다진 마늘을 볶습니다', timer: 120 },
              { instruction: '토마토 소스를 붓고 끓여줍니다', timer: 300 },
              { instruction: '삶은 파스타와 소스를 섞고 소금, 후추로 간을 합니다', timer: 60 }
            ]
          };
          
          setMessages(prev => [...prev, {
            type: 'ai',
            content: (
              <div>
                <p>{pastaRecipe.title} 레시피를 알려드립니다!</p>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => startCookingGuide(pastaRecipe)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
                  >
                    요리 시작하기
                  </button>
                  <button 
                    onClick={() => toggleFavorite(pastaRecipe)}
                    className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <span 
                      className={`text-xl transition-all duration-300 transform ${
                        animatingFavorite === pastaRecipe.title ? 'scale-150' : ''
                      } ${
                        favorites.find(item => item.title === pastaRecipe.title) 
                          ? 'text-yellow-400 drop-shadow-md' 
                          : 'text-gray-400'
                      }`}
                    >
                      {favorites.find(item => item.title === pastaRecipe.title) 
                        ? '★' 
                        : '☆'}
                    </span>
                    <span>
                      {favorites.find(item => item.title === pastaRecipe.title) 
                        ? '즐겨찾기 완료' 
                        : '즐겨찾기'}
                    </span>
                  </button>
                </div>
              </div>
            )
          }]);
        } else {
          // 기존 레시피 응답 로직
          const recipe = {
            title: '두부 스테이크',
            steps: [
              { instruction: '두부를 1.5cm 두께로 자르고 소금과 후추로 밑간합니다', timer: 0 },
              { instruction: '팬에 올리브 오일을 두르고 중간 불로 가열합니다', timer: 120 },
              { instruction: '두부를 넣고 앞뒤로 노릇하게 구워줍니다', timer: 300 }
            ]
          };
          
          setMessages(prev => [...prev, {
            type: 'ai',
            content: (
              <div>
                <p>{recipe.title} 레시피를 알려드리겠습니다!</p>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => startCookingGuide(recipe)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
                  >
                    요리 시작하기
                  </button>
                  <button 
                    onClick={() => toggleFavorite(recipe)}
                    className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <span 
                      className={`text-xl transition-all duration-300 transform ${
                        animatingFavorite === recipe.title ? 'scale-150' : ''
                      } ${
                        favorites.find(item => item.title === recipe.title) 
                          ? 'text-yellow-400 drop-shadow-md' 
                          : 'text-gray-400'
                      }`}
                    >
                      {favorites.find(item => item.title === recipe.title) 
                        ? '★' 
                        : '☆'}
                    </span>
                    <span>
                      {favorites.find(item => item.title === recipe.title) 
                        ? '즐겨찾기 완료' 
                        : '즐겨찾기'}
                    </span>
                  </button>
                </div>
              </div>
            )
          }]);
        }
      } else if (submitInput.includes('팁') || submitInput.includes('실수') || submitInput.includes('방법')) {
        // 기존 조리팁 응답 로직
        setMessages(prev => [...prev, {
          type: 'ai',
          content: '요리할 때 자주 하는 실수는 정확한 계량을 하지 않는 것입니다. 특히 베이킹의 경우 정확한 계량이 매우 중요합니다.',
          suggestion: '계량스푼과 계량컵을 활용하세요.'
        }]);
      } else {
        // 기타 일반 응답
        setMessages(prev => [...prev, {
          type: 'ai',
          content: '건강한 감미료로는 메이플 시럽, 아가베 시럽, 스테비아 등이 있습니다.',
          suggestion: user.name 
            ? `${user.name}님, "내 취향에 맞는 요리 추천해줘"라고 물어보시면 맞춤 추천을 받으실 수 있어요!` 
            : '프로필 설정을 완료하시면 취향에 맞는 요리를 추천해드릴 수 있어요!'
        }]);
      }
      
      setIsLoading(false);
    }, 1000);

    setInput('');
  }

  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion)
    handleSubmit(null, suggestion)
  }

  const isLastStep = currentRecipe ? currentStep === currentRecipe.steps.length - 1 : false;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
      {/* 헤더 */}
      <div className="text-center pt-6 mb-8">
        <div className="inline-block relative mb-2">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-fadeIn">
            달그락
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"></div>
        </div>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-slideUp mt-6">
          {user.name 
            ? `${user.name}님, 오늘은 어떤 요리를 해볼까요?`
            : '당신만을 위한 AI 요리 어시스턴트'}
        </p>
      </div>
      
      {/* 사용자 프로필 표시 (로그인 상태일 때) */}
      {user.name && !showCookingGuide && (
        <div className="flex items-center justify-center mb-6">
          <div 
            className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
              {user.profileImage ? (
                <img src={user.profileImage} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              내 프로필
              {user.preferences?.vegetarian && ' • 채식'}
              {user.preferences?.spicyLevel !== '보통' && ` • ${user.preferences?.spicyLevel} 맛`}
            </span>
          </div>
        </div>
      )}

      {!showCookingGuide ? (
        // 일반 채팅 인터페이스
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 animate-fadeIn">
          {/* 채팅 메시지 영역 */}
          <div 
            ref={chatContainerRef}
            className="chat-messages h-[450px] overflow-y-auto mb-5 p-5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600"
          >
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-5`}
              >
                {message.type === 'ai' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-md">
                    <span className="text-white text-sm font-medium">AI</span>
                  </div>
                )}
                
                <div 
                  className={`py-3 px-5 rounded-2xl max-w-[75%] animate-messageIn shadow-sm
                    ${message.type === 'ai' 
                      ? 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto'
                    }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="prose dark:prose-invert">
                    {message.content}
                  </div>
                  
                  {message.suggestion && (
                    <p className="text-xs mt-2 opacity-80 italic">
                      {message.suggestion}
                    </p>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center ml-3 shadow-md">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300 text-sm font-medium">나</span>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <div className="flex items-center ml-12 my-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-md">
                  <span className="text-white text-sm font-medium">AI</span>
                </div>
                <div className="typing-indicator bg-white dark:bg-gray-800 py-2 px-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          
          {/* 빠른 제안 */}
          <div className="mb-5 flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="text-xs font-medium px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm border border-gray-200 dark:border-gray-600"
              >
                {suggestion}
              </button>
            ))}
            
            {/* 사용자 취향 기반 추천 버튼 (로그인 시에만 표시) */}
            {user.name && (
              <button
                onClick={() => handleQuickSuggestion("내 취향에 맞는 요리 추천해줘")}
                className="text-xs font-medium px-4 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40 transition-all duration-200 shadow-sm border border-blue-200 dark:border-blue-800/60"
              >
                내 취향 요리 추천해줘
              </button>
            )}
          </div>

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isListening}
                placeholder={isListening ? "말씀해주세요..." : "예) 오늘은 파스타를 만들고 싶어요"}
                className={`w-full p-4 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                         dark:bg-gray-700 dark:text-white shadow-sm
                         dark:placeholder-gray-400 transition-all duration-300
                         ${isListening ? 'pr-12 pl-4 border-red-400 dark:border-red-500' : ''}`}
              />
              
              {/* 음성 인식 버튼 */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full
                           ${isListening 
                              ? 'bg-red-500 text-white animate-pulse' 
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                           } transition-all duration-300`}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={isLoading || isListening || !input.trim()}
              className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-full 
                       transition-all duration-300 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800
                       transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-md
                       ${(isLoading || isListening || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </form>
          
          {/* 음성 인식 안내 */}
          {speechSupported && (
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm">
                <span className="text-lg">🎙️</span>
                <p>마이크 버튼을 누르고 말씀해보세요!</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // 요리 가이드 모드 (요리 가이드 + 채팅 통합) - 향상된 UI
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 왼쪽 영역 - 요리 가이드 */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5">
            {/* 헤더 - 요리 제목 및 닫기 버튼 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">{currentRecipe.title} 요리 가이드</h2>
              <button 
                onClick={closeCookingGuide}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* 타이머 섹션 (위쪽 배치) */}
            {currentRecipe?.steps[currentStep].timer > 0 && (
              <div className="mb-6 flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-medium mb-3 dark:text-white">타이머</h3>
                
                {timer === null ? (
                  <button 
                    onClick={startTimer}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center gap-2 shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    타이머 시작 ({formatTime(currentRecipe.steps[currentStep].timer)})
                  </button>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    {/* 원형 타이머 */}
                    <div className="relative w-48 h-48 mb-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* 배경 원 */}
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke={timer === 'paused' ? "#e5e7eb" : "#f3f4f6"}
                          strokeWidth="8"
                        />
                        {/* 진행 원 */}
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke={timer === 'paused' ? "#93c5fd" : "#3b82f6"} 
                          strokeWidth="8"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * calculateProgress() / 100)}
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-mono font-bold dark:text-white">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    </div>
                    
                    {/* 타이머 컨트롤 */}
                    <div className="flex gap-4 w-full justify-center">
                      <button 
                        onClick={toggleTimer}
                        className={`px-5 py-3 rounded-lg flex-1 flex items-center justify-center gap-2 shadow-sm max-w-xs
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
                        className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg flex-1 flex items-center justify-center gap-2 shadow-sm max-w-xs"
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
            
            {/* 진행 상태 바 */}
            <div className="mb-4 relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                    진행률
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-300">
                    {Math.round((currentStep / (currentRecipe?.steps.length - 1)) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900/30">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-600 transition-all duration-500 ease-in-out"
                  style={{ width: `${(currentStep / (currentRecipe?.steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* 요리 단계 목록 (아코디언 스타일) */}
            <div className="mb-6 space-y-4">
              {currentRecipe.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg overflow-hidden transition-all duration-300 
                    ${index === currentStep 
                      ? 'border-blue-500 dark:border-blue-600 shadow-md' 
                      : 'border-gray-200 dark:border-gray-600'}`}
                >
                  <div 
                    className={`flex items-center p-4 cursor-pointer
                      ${index === currentStep 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-bold
                      ${index === currentStep 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
                    >
                      {index + 1}
                    </div>
                    <h3 className={`font-medium ${index === currentStep ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {index === currentStep ? (
                        <span className="font-bold">현재 단계: {step.instruction.substring(0, 30)}{step.instruction.length > 30 ? '...' : ''}</span>
                      ) : (
                        <span>{step.instruction.substring(0, 30)}{step.instruction.length > 30 ? '...' : ''}</span>
                      )}
                    </h3>
                  </div>
                  
                  {/* 현재 단계 상세 정보 */}
                  {index === currentStep && (
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{step.instruction}</p>
                      
                      {step.timer > 0 && timer === null && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                          이 단계에는 타이머({formatTime(step.timer)})가 필요합니다. 위의 타이머를 시작하세요.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* 이전/다음/완료 버튼 */}
            <div className="flex justify-between mt-6">
              <button 
                onClick={() => {
                  setCurrentStep(prev => Math.max(0, prev - 1));
                  setTimer(null);
                  setShowTimerNotification(false);
                }}
                disabled={currentStep === 0}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors
                    ${currentStep === 0 
                        ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
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
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                >
                  요리 완료
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setCurrentStep(prev => Math.min(currentRecipe?.steps.length - 1, prev + 1));
                    setTimer(null);
                    setShowTimerNotification(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                >
                  다음
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* 오른쪽 영역 - 요리 중 채팅 */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-800 p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                <span className="text-white font-medium">AI</span>
              </div>
              <h3 className="text-xl font-bold dark:text-white">요리 도우미</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 ml-1">
              요리하면서 궁금한 점이 있으면 물어보세요!
            </p>
            
            {/* 채팅 영역 - 높이 증가 */}
            <div className="h-[350px] overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              {messages.slice(-10).map((message, index) => (
                <div 
                  key={`cooking-chat-${index}`}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                >
                  {message.type === 'ai' && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-2 shadow-sm">
                      <span className="text-white text-xs">AI</span>
                    </div>
                  )}
                  
                  <div 
                    className={`py-2.5 px-3.5 rounded-lg max-w-[85%] text-sm
                      ${message.type === 'ai' 
                        ? 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      }`}
                  >
                    {message.content}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ml-2 shadow-sm">
                      <span className="text-gray-500 dark:text-gray-300 text-xs">나</span>
                    </div>
                  )}
                </div>
              ))}
              
              <div ref={messagesEndRef} />
              
              {isLoading && (
                <div className="flex items-center my-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-2">
                    <span className="text-white text-xs">AI</span>
                  </div>
                  <div className="typing-indicator bg-white dark:bg-gray-800 py-1.5 px-3 rounded-lg border border-gray-100 dark:border-gray-600">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
            
            {/* 요리 중 빠른 제안 - 크기 증가 및 레이아웃 개선 */}
            <div className="mb-4 flex flex-wrap gap-2">
              {cookingSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            {/* 채팅 입력 폼 - 크기 증가 */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="요리하면서 질문하세요..."
                className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-full 
                        transition-all duration-300 flex items-center justify-center w-12 h-12
                        ${(isLoading || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </form>
            
            {/* 음성 입력 버튼 추가 */}
            {speechSupported && (
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-all duration-300`}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                  {isListening ? '음성 인식 중...' : '음성으로 질문하기'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 타이머 알림 팝업 */}
      {showTimerNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">타이머 완료!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">다음 단계로 진행할 준비가 되었습니다.</p>
              <button 
                onClick={() => setShowTimerNotification(false)}
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
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white">요리 완료!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {currentRecipe?.title} 요리가 완료되었습니다. 맛있게 드세요!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={goToRatePage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  요리 평가하기
                </button>
                <button 
                  onClick={closeCookingGuide}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  채팅으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 오디오 요소 */}
      <audio ref={audioRef}>
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default Home