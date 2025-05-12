// src/features/chat/hooks/useRecipeParsing.js
import { useCallback } from 'react';

export function useRecipeParsing() {
  /**
   * 텍스트가 레시피를 포함하는지 검증하는 함수
   * @param {string} text - 분석할 텍스트
   * @returns {boolean} - 레시피가 포함되어 있는지 여부
   */
  const isRecipeResponse = useCallback((text) => {
    if (!text || text.trim().length === 0) return false;
    
    // 레시피를 나타내는 키워드 및 패턴 검사
    return text.includes('레시피:') || 
           text.includes('재료:') || 
           text.includes('만드는 법:') ||
           text.includes('조리법:') ||
           text.match(/Step\s+\d+/) || 
           text.match(/단계\s+\d+/) || 
           text.match(/\d+\.\s+/) ||
           (text.match(/\d+\)/) && text.includes('분'));
  }, []);

  /**
   * 텍스트에서 레시피 정보를 추출하여 구조화된 객체로 반환
   * @param {string} text - 분석할 텍스트
   * @returns {Object|null} - 추출된 레시피 객체 또는 null
   */
  const parseRecipeFromText = useCallback((text) => {
    try {
      console.log("Parsing recipe from text:", text.substring(0, 200) + "...");
      
      // 텍스트에 레시피 구조가 없는 경우 null 반환
      if (!isRecipeResponse(text)) {
        console.log("No recipe structure detected in text");
        return null;
      }
      
      // 제목 추출
      let title = '레시피';
      const titleMatches = [
        /레시피[:：]\s*([^\n]+)/,
        /^(.+?)[레시피|요리법|만드는 법]/m,
        /^(.+?)$/m
      ];
      
      for (const pattern of titleMatches) {
        const match = text.match(pattern);
        if (match && match[1] && match[1].trim().length > 0) {
          title = match[1].trim();
          break;
        }
      }
      
      // 재료 추출
      let ingredients = [];
      const ingredientSection = text.match(/재료:[\s\n]+(.*?)(?=Step|단계|\d+\.|$)/s);
      if (ingredientSection && ingredientSection[1]) {
        ingredients = ingredientSection[1]
          .split('\n')
          .map(item => item.replace(/^[•\-\*]\s*/, '').trim())
          .filter(item => item.length > 0);
      }
      
      // 단계 추출
      const steps = [];
      
      // Step 1: ... 또는 단계 1: ... 형식
      const formalStepRegex = /(?:Step|단계)\s+(\d+)[:\s]+([^Step|단계]+?)(?=(?:Step|단계)\s+\d+|$)/gs;
      let match;
      while ((match = formalStepRegex.exec(text)) !== null) {
        const stepNumber = parseInt(match[1]);
        const instruction = match[2].trim();
        
        // 타이머 추출 (분 단위)
        let timer = 0;
        const timeMatch = instruction.match(/(\d+)\s*분/);
        if (timeMatch && timeMatch[1]) {
          timer = parseInt(timeMatch[1]);
        }
        
        steps.push({
          instruction,
          timer,
          stepNumber
        });
      }
      
      // 1. ... 또는 1) ... 형식
      if (steps.length === 0) {
        const numberedStepRegex = /(\d+)[\.\)]\s*([^\d\.\)][^\n]+)/g;
        let stepNumber = 1;
        
        while ((match = numberedStepRegex.exec(text)) !== null) {
          const instruction = match[2].trim();
          
          // 타이머 추출
          let timer = 0;
          const timeMatch = instruction.match(/(\d+)\s*분/);
          if (timeMatch && timeMatch[1]) {
            timer = parseInt(timeMatch[1]);
          }
          
          steps.push({
            instruction,
            timer: timer || 5, // 기본 5분
            stepNumber: stepNumber++
          });
        }
      }
      
      // 문단 단위 추출 (마지막 수단)
      if (steps.length === 0) {
        const paragraphs = text.split('\n\n');
        let stepNumber = 1;
        
        for (const paragraph of paragraphs) {
          const trimmed = paragraph.trim();
          if (trimmed.length > 10 && 
              !trimmed.startsWith('재료:') && 
              !trimmed.startsWith('레시피:')) {
            
            let timer = 0;
            const timeMatch = trimmed.match(/(\d+)\s*분/);
            if (timeMatch && timeMatch[1]) {
              timer = parseInt(timeMatch[1]);
            }
            
            steps.push({
              instruction: trimmed,
              timer: timer || 5,
              stepNumber: stepNumber++
            });
          }
        }
      }
      
      // 단계가 없는 경우 기본 단계 생성
      if (steps.length === 0) {
        console.log("No steps found, creating a default step");
        steps.push({
          instruction: "AI가 제안한 방법으로 요리를 진행해보세요.",
          timer: 10,
          stepNumber: 1
        });
      }
      
      // 총 조리 시간 계산
      const totalTime = steps.reduce((total, step) => total + (step.timer || 0), 0) || 30;
      
      console.log(`Extracted recipe: ${title} with ${steps.length} steps`);
      
      return {
        title,
        steps,
        ingredients,
        cookingTime: totalTime || 30,
        id: Date.now(),
        recipeId: Date.now()
      };
    } catch (error) {
      console.error('Recipe parsing error:', error);
      return null;
    }
  }, [isRecipeResponse]);

  return { 
    parseRecipeFromText,
    isRecipeResponse 
  };
}