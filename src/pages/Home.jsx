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
  
  // 음성 인식 관련 상태
  const [isListening, setIsListening] = useState(false)
  const [speechRecognition, setSpeechRecognition] = useState(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  
  const [quickSuggestions] = useState([
    "간단한 저녁 메뉴 추천해줘",
    "파스타 요리법 알려줘",
    "건강한 샐러드 레시피 알려줘",
    "남은 계란으로 만들 수 있는 요리는?",
    "요리 초보를 위한 팁"
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
          { instruction: '물을 끓인 후 소금을 넣고 파스타를 삶습니다', timer: 0 },
          { instruction: '토마토 소스를 만듭니다', timer: 300 },
          { instruction: '파스타와 소스를 섞습니다', timer: 60 }
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

  const handleSubmit = async (e, voiceInput = null) => {
    e?.preventDefault();
    
    const submitInput = voiceInput || input;
    if (!submitInput.trim() || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', content: submitInput }]);
    setIsLoading(true);

    // 타이머 설정 (시뮬레이션)
    setTimeout(() => {
      // 사용자 취향 반영한 추천 로직
      if (submitInput.includes('추천') || submitInput.includes('뭐') || submitInput.includes('먹을') || submitInput.includes('취향')) {
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
                      onClick={() => navigate('/guide', { 
                        state: { recipe }
                      })}
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
                  onClick={() => navigate('/guide', { 
                    state: { recipe }
                  })}
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
      {user.name && (
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

      {/* 메인 채팅 컨테이너 */}
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
      </div>
      
      {/* 음성 인식 안내 */}
      {speechSupported && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm">
            <span className="text-lg">🎙️</span>
            <p>마이크 버튼을 누르고 말씀해보세요!</p>
          </div>
        </div>
      )}
      
      {/* 푸터/팁 */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm">
          <span className="text-lg">🔍</span>
          <p>요리법, 재료 활용, 조리 팁 등 다양한 질문을 해보세요!</p>
        </div>
      </div>
      
      {/* 프로필 설정 유도 (로그인 안 한 경우) */}
      {!user.name && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center">
          <p className="text-blue-600 dark:text-blue-300 mb-2">
            프로필을 설정하면 취향에 맞는 요리를 추천받을 수 있어요!
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            프로필 설정하기
          </button>
        </div>
      )}
      
      {/* 브라우저 음성 인식 미지원 알림 */}
      {!speechSupported && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-center">
          <p className="text-yellow-600 dark:text-yellow-300 text-sm">
            현재 브라우저에서 음성 인식 기능이 지원되지 않습니다.
          </p>
        </div>
      )}
    </div>
  )
}

export default Home