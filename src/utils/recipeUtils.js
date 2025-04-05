// src/utils/recipeUtils.js

// 사용자 취향에 맞는 레시피 추천
export function getPersonalizedRecipes(userPreferences = {}) {
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
      // 더 많은 레시피 추가...
    ];
    
    // 사용자 취향에 맞게 필터링
    let filteredRecipes = [...recipeDatabase];
    
    // 채식 필터링
    if (userPreferences?.vegetarian) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.vegetarian);
    }
    
    // 매운맛 필터링
    if (userPreferences?.spicyLevel === '안매움') {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.spicyLevel === '안매움');
    } else if (userPreferences?.spicyLevel === '아주매움') {
      filteredRecipes = filteredRecipes.filter(recipe => ['매움', '아주매움'].includes(recipe.spicyLevel));
    }
    
    // 조리 시간 필터링
    if (userPreferences?.cookingTime <= 15) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.cookingTime <= 20);
    }
    
    // 추천할 레시피가 없으면 기본 레시피 반환
    if (filteredRecipes.length === 0) {
      return [recipeDatabase[2]]; // 두부 스테이크는 무난한 선택
    }
    
    // 취향에 맞는 레시피 중 무작위로 선택 (최대 2개)
    const shuffled = filteredRecipes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(2, shuffled.length));
  }
  
  // 요리 중 질문에 대한 응답 생성
  export function getCookingRelatedAnswer(question, recipe) {
    // 요리 중 자주 묻는 질문에 대한 답변
    if (question.includes('대체') || question.includes('재료')) {
      return `일반적으로 ${recipe.title}에서 재료를 대체할 때는 비슷한 식감과 맛을 가진 것을 선택하는 것이 좋습니다. 구체적으로 어떤 재료를 대체하고 싶으신가요?`;
    }
    else if (question.includes('소금') || question.includes('간')) {
      return `${recipe.title}에는 전체 재료의 1~2% 정도의 소금이 적당합니다. 조금씩 넣어가며 맛을 보는 것이 좋아요.`;
    }
    else if (question.includes('보관') || question.includes('저장')) {
      return `${recipe.title}는 완전히 식힌 후 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 맛있게 드실 수 있습니다.`;
    }
    else if (question.includes('음료') || question.includes('와인') || question.includes('맥주')) {
      return `${recipe.title}와 잘 어울리는 음료로는 ${recipe.title.includes('파스타') ? '드라이한 화이트 와인' : recipe.title.includes('매운') ? '라거 맥주' : '탄산수나 에이드류'}가 좋습니다.`;
    }
    else {
      return `요리 중에 도움이 필요하시군요! ${recipe.title} 요리에 대해 더 구체적인 질문이 있으시면 알려주세요.`;
    }
  }