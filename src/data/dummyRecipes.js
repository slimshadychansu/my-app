// src/data/dummyRecipes.js

const dummyRecipes = [
    {
      id: "rec001",
      title: "토마토 파스타",
      description: "간단하고 맛있는 토마토 소스 파스타 레시피입니다. 20분이면 완성됩니다.",
      cookingTime: 20,
      difficulty: "쉬움",
      spicyLevel: "약간",
      vegetarian: true,
      calories: 450,
      servings: 2,
      ingredients: [
        { name: "스파게티면", amount: "200g" },
        { name: "토마토 소스", amount: "300g" },
        { name: "올리브 오일", amount: "2큰술" },
        { name: "마늘", amount: "3쪽" },
        { name: "양파", amount: "1/2개" },
        { name: "파르메산 치즈", amount: "적당량" },
        { name: "소금", amount: "약간" },
        { name: "후추", amount: "약간" },
        { name: "바질", amount: "5~6잎" }
      ],
      steps: [
        { instruction: "물을 끓인 후 소금을 넣고 파스타를 포장지에 적힌 시간만큼 삶습니다", timer: 600 },
        { instruction: "팬에 올리브 오일을 두르고 다진 마늘과 양파를 볶습니다", timer: 120 },
        { instruction: "토마토 소스를 넣고 중불에서 5분간 끓여줍니다", timer: 300 },
        { instruction: "삶은 파스타를 소스에 넣고 잘 섞어줍니다", timer: 60 },
        { instruction: "소금과 후추로 간을 맞추고 바질을 올려 마무리합니다", timer: 0 }
      ],
      tags: ["파스타", "이탈리안", "토마토", "간단요리", "채식"],
      imageUrl: "https://example.com/images/tomato-pasta.jpg",
      author: "요리왕",
      createdAt: "2024-01-15T14:30:00Z",
      updatedAt: "2024-03-10T09:25:00Z",
      reviews: [
        {
          id: "rev001",
          userId: "user123",
          userName: "파스타러버",
          rating: 5,
          comment: "정말 맛있고 간단해요! 자주 해먹을 것 같습니다.",
          isPublic: true,
          createdAt: "2024-01-20T18:25:00Z"
        },
        {
          id: "rev002",
          userId: "user456",
          userName: "요리초보",
          rating: 4,
          comment: "처음 만들어봤는데 생각보다 쉽고 맛있었어요.",
          isPublic: true,
          createdAt: "2024-02-05T12:10:00Z"
        }
      ],
      nutrition: {
        protein: "12g",
        carbohydrates: "65g",
        fat: "15g",
        fiber: "5g",
        sugar: "8g"
      },
      tips: [
        "파스타를 삶을 때는 물을 충분히 사용하세요.",
        "소스에 삶은 파스타 물을 조금 넣으면 더 맛있어집니다.",
        "신선한 바질이 없다면 건조 바질을 사용해도 괜찮습니다."
      ]
    },
    {
      id: "rec002",
      title: "매운 닭갈비",
      description: "춘천식 매운 닭갈비 레시피입니다. 가족 식사로 좋은 한국 전통 요리입니다.",
      cookingTime: 40,
      difficulty: "보통",
      spicyLevel: "매움",
      vegetarian: false,
      calories: 650,
      servings: 4,
      ingredients: [
        { name: "닭다리살", amount: "600g" },
        { name: "양배추", amount: "1/4개" },
        { name: "떡", amount: "200g" },
        { name: "고구마", amount: "1개" },
        { name: "대파", amount: "2대" },
        { name: "고춧가루", amount: "3큰술" },
        { name: "고추장", amount: "2큰술" },
        { name: "간장", amount: "1큰술" },
        { name: "다진 마늘", amount: "1큰술" },
        { name: "설탕", amount: "1큰술" },
        { name: "참기름", amount: "1작은술" }
      ],
      steps: [
        { instruction: "닭고기를 씻어서 물기를 제거하고 적당한 크기로 자릅니다", timer: 0 },
        { instruction: "양념 재료를 모두 섞고 닭고기에 버무려 30분간 재워둡니다", timer: 1800 },
        { instruction: "팬을 달군 후 양념한 닭고기를 넣고 중불에서 5분간 볶습니다", timer: 300 },
        { instruction: "채소와 떡을 넣고 10분 더 볶아줍니다", timer: 600 },
        { instruction: "불을 약하게 줄이고 뚜껑을 덮어 5분간 더 익혀줍니다", timer: 300 }
      ],
      tags: ["한식", "닭갈비", "매운음식", "메인요리"],
      imageUrl: "https://example.com/images/spicy-chicken.jpg",
      author: "한식마스터",
      createdAt: "2024-02-10T10:15:00Z",
      updatedAt: "2024-03-15T14:20:00Z",
      reviews: [
        {
          id: "rev003",
          userId: "user789",
          userName: "매운맛좋아",
          rating: 5,
          comment: "정말 맛있어요! 집에서 먹는 닭갈비 중 최고입니다.",
          isPublic: true,
          createdAt: "2024-02-20T19:30:00Z"
        }
      ],
      nutrition: {
        protein: "35g",
        carbohydrates: "45g",
        fat: "22g",
        fiber: "4g",
        sugar: "10g"
      },
      tips: [
        "닭고기는 가능한 신선한 것을 사용하세요.",
        "양념은 하루 전에 미리 해두면 더 맛있습니다.",
        "떡이 마르면 물을 조금 넣어주세요."
      ]
    },
    {
      id: "rec003",
      title: "두부 스테이크",
      description: "건강한 식단을 위한 채식 요리! 고기 없이도 풍부한 맛을 즐길 수 있는 두부 스테이크입니다.",
      cookingTime: 15,
      difficulty: "쉬움",
      spicyLevel: "안매움",
      vegetarian: true,
      calories: 300,
      servings: 2,
      ingredients: [
        { name: "두부", amount: "1모" },
        { name: "올리브 오일", amount: "2큰술" },
        { name: "간장", amount: "1큰술" },
        { name: "발사믹 식초", amount: "1큰술" },
        { name: "꿀", amount: "1작은술" },
        { name: "소금", amount: "약간" },
        { name: "후추", amount: "약간" },
        { name: "로즈마리", amount: "약간" }
      ],
      steps: [
        { instruction: "두부를 1.5cm 두께로 자르고 키친타올로 물기를 제거합니다", timer: 0 },
        { instruction: "두부에 소금과 후추로 밑간을 합니다", timer: 0 },
        { instruction: "팬에 올리브 오일을 두르고 중간 불로 가열합니다", timer: 120 },
        { instruction: "두부를 넣고 앞뒤로 노릇하게 구워줍니다", timer: 300 },
        { instruction: "간장, 발사믹 식초, 꿀을 섞어 소스를 만듭니다", timer: 0 },
        { instruction: "구운 두부에 소스를 끼얹고 로즈마리를 뿌려 마무리합니다", timer: 60 }
      ],
      tags: ["채식", "건강식", "두부", "간단요리", "저칼로리"],
      imageUrl: "https://example.com/images/tofu-steak.jpg",
      author: "건강요리사",
      createdAt: "2024-01-05T09:45:00Z",
      updatedAt: "2024-03-02T11:30:00Z",
      reviews: [
        {
          id: "rev004",
          userId: "user101",
          userName: "채식주의자",
          rating: 4,
          comment: "간단하면서도 영양가 있는 요리네요. 소스가 정말 맛있습니다!",
          isPublic: true,
          createdAt: "2024-01-10T20:15:00Z"
        }
      ],
      nutrition: {
        protein: "15g",
        carbohydrates: "8g",
        fat: "12g",
        fiber: "2g",
        sugar: "3g"
      },
      tips: [
        "두부는 단단한 것을 선택하는 것이 좋습니다.",
        "물기를 충분히 제거해야 노릇하게 구워집니다.",
        "소스 재료의 비율은 입맛에 따라 조절해보세요."
      ]
    }
  ];
  
  export default dummyRecipes;