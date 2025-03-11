import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '../store/atoms'
import { FadeIn } from '../components/animation/FadeIn'
import Button from '../components/common/Button'

function BoardWrite() {
   const navigate = useNavigate()
   const user = useRecoilValue(userState)
   const fileInputRef = useRef(null)
   
   const [postData, setPostData] = useState({
       title: '',
       content: '',
       category: 'recipe', // 'recipe', 'daily', 'question', 'tip'
       tags: [],
       images: [],
       recipeDetails: {
           cookingTime: 30,
           difficulty: '보통',
           ingredients: [{ name: '', amount: '' }]
       }
   })
   
   const [tagInput, setTagInput] = useState('')
   const [previewImages, setPreviewImages] = useState([])
   const [isDragging, setIsDragging] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)

   // 카테고리 변경 처리
   const handleCategoryChange = (e) => {
       setPostData({...postData, category: e.target.value})
   }
   
   // 태그 추가
   const handleAddTag = (e) => {
       e.preventDefault()
       if (!tagInput.trim()) return
       
       // 중복 태그 방지 및 최대 5개 제한
       if (!postData.tags.includes(tagInput) && postData.tags.length < 5) {
           setPostData({...postData, tags: [...postData.tags, tagInput]})
       }
       
       setTagInput('')
   }
   
   // 태그 삭제
   const removeTag = (tagToRemove) => {
       setPostData({
           ...postData, 
           tags: postData.tags.filter(tag => tag !== tagToRemove)
       })
   }
   
   // 파일 선택 처리
   const handleFileSelect = (e) => {
       const selectedFiles = Array.from(e.target.files)
       handleFiles(selectedFiles)
   }
   
   // 드래그 앤 드롭 처리
   const handleDragOver = (e) => {
       e.preventDefault()
       setIsDragging(true)
   }
   
   const handleDragLeave = () => {
       setIsDragging(false)
   }
   
   const handleDrop = (e) => {
       e.preventDefault()
       setIsDragging(false)
       
       if (e.dataTransfer.files.length > 0) {
           const droppedFiles = Array.from(e.dataTransfer.files)
           handleFiles(droppedFiles)
       }
   }
   
   // 파일 처리
   const handleFiles = (files) => {
       // 이미지 파일만 필터링
       const imageFiles = files.filter(file => file.type.startsWith('image/'))
       
       // 최대 5개까지 이미지 추가 가능
       const totalImages = [...postData.images, ...imageFiles]
       const limitedImages = totalImages.slice(0, 5)
       
       // 이미지 미리보기 생성
       const newPreviews = imageFiles.map(file => URL.createObjectURL(file))
       
       setPostData(prev => ({
           ...prev,
           images: limitedImages
       }))
       
       setPreviewImages(prev => {
           const combinedPreviews = [...prev, ...newPreviews]
           return combinedPreviews.slice(0, 5)
       })
   }
   
   // 이미지 삭제
   const removeImage = (index) => {
       setPostData(prev => ({
           ...prev,
           images: prev.images.filter((_, i) => i !== index)
       }))
       
       // 해당 미리보기 URL 해제
       URL.revokeObjectURL(previewImages[index])
       
       setPreviewImages(prev => prev.filter((_, i) => i !== index))
   }
   
   // 레시피 재료 추가
   const addIngredient = () => {
       setPostData(prev => ({
           ...prev,
           recipeDetails: {
               ...prev.recipeDetails,
               ingredients: [...prev.recipeDetails.ingredients, { name: '', amount: '' }]
           }
       }))
   }
   
   // 레시피 재료 삭제
   const removeIngredient = (index) => {
       if (postData.recipeDetails.ingredients.length <= 1) return
       
       setPostData(prev => ({
           ...prev,
           recipeDetails: {
               ...prev.recipeDetails,
               ingredients: prev.recipeDetails.ingredients.filter((_, i) => i !== index)
           }
       }))
   }
   
   // 레시피 재료 정보 변경
   const handleIngredientChange = (index, field, value) => {
       setPostData(prev => {
           const updatedIngredients = [...prev.recipeDetails.ingredients]
           updatedIngredients[index] = {
               ...updatedIngredients[index],
               [field]: value
           }
           
           return {
               ...prev,
               recipeDetails: {
                   ...prev.recipeDetails,
                   ingredients: updatedIngredients
               }
           }
       })
   }
   
   // 난이도 또는 조리시간 변경
   const handleRecipeDetailChange = (field, value) => {
       setPostData(prev => ({
           ...prev,
           recipeDetails: {
               ...prev.recipeDetails,
               [field]: value
           }
       }))
   }
   
   // 게시글 전송
   const handleSubmit = async (e) => {
       e.preventDefault()
       
       if (!user.isLoggedIn) {
           alert('로그인 후 이용해주세요')
           navigate('/login')
           return
       }
       
       if (!postData.title.trim()) {
           alert('제목을 입력해주세요')
           return
       }
       
       if (!postData.content.trim()) {
           alert('내용을 입력해주세요')
           return
       }
       
       // 레시피 카테고리인 경우 재료 확인
       if (postData.category === 'recipe') {
           const emptyIngredients = postData.recipeDetails.ingredients.some(ing => !ing.name.trim())
           if (emptyIngredients) {
               alert('재료 이름을 모두 입력해주세요')
               return
           }
       }
       
       setIsSubmitting(true)
       
       try {
           // 서버 연결이 되면 FormData를 사용하여 이미지 업로드 처리
           // 여기에 API 연동 코드 작성
           
           // 서버 연결 없이 테스트용 지연 시간
           setTimeout(() => {
               console.log('게시글 작성:', postData)
               navigate('/board')
           }, 1000)
       } catch (error) {
           console.error('게시글 저장 오류:', error)
           alert('게시글 저장 중 오류가 발생했습니다.')
       } finally {
           setIsSubmitting(false)
       }
   }

   return (
       <FadeIn>
           <div className="max-w-4xl mx-auto p-4">
               <h1 className="text-2xl font-bold mb-6 dark:text-white">게시글 작성</h1>

               <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                   {/* 카테고리 선택 */}
                   <div className="mb-6">
                       <label className="block mb-2 font-semibold dark:text-white">카테고리</label>
                       <div className="flex flex-wrap gap-3">
                           <label className={`px-4 py-2 rounded-full cursor-pointer transition-colors
                               ${postData.category === 'recipe' 
                                   ? 'bg-blue-500 text-white' 
                                   : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                           >
                               <input 
                                   type="radio" 
                                   name="category" 
                                   value="recipe" 
                                   checked={postData.category === 'recipe'} 
                                   onChange={handleCategoryChange}
                                   className="sr-only"
                               />
                               레시피
                           </label>
                           <label className={`px-4 py-2 rounded-full cursor-pointer transition-colors
                               ${postData.category === 'daily' 
                                   ? 'bg-blue-500 text-white' 
                                   : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                           >
                               <input 
                                   type="radio" 
                                   name="category" 
                                   value="daily" 
                                   checked={postData.category === 'daily'} 
                                   onChange={handleCategoryChange}
                                   className="sr-only"
                               />
                               일상
                           </label>
                           <label className={`px-4 py-2 rounded-full cursor-pointer transition-colors
                               ${postData.category === 'question' 
                                   ? 'bg-blue-500 text-white' 
                                   : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                           >
                               <input 
                                   type="radio" 
                                   name="category" 
                                   value="question" 
                                   checked={postData.category === 'question'} 
                                   onChange={handleCategoryChange}
                                   className="sr-only"
                               />
                               질문
                           </label>
                           <label className={`px-4 py-2 rounded-full cursor-pointer transition-colors
                               ${postData.category === 'tip' 
                                   ? 'bg-blue-500 text-white' 
                                   : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                           >
                               <input 
                                   type="radio" 
                                   name="category" 
                                   value="tip" 
                                   checked={postData.category === 'tip'} 
                                   onChange={handleCategoryChange}
                                   className="sr-only"
                               />
                               꿀팁
                           </label>
                       </div>
                   </div>

                   {/* 제목 입력 */}
                   <div className="mb-4">
                       <label className="block mb-2 font-semibold dark:text-white">제목</label>
                       <input
                           type="text"
                           value={postData.title}
                           onChange={(e) => setPostData({...postData, title: e.target.value})}
                           className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="제목을 입력하세요"
                           required
                       />
                   </div>
                   
                   {/* 레시피 카테고리 선택 시 추가 정보 */}
                   {postData.category === 'recipe' && (
                       <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                           <h3 className="font-semibold mb-3 dark:text-white">레시피 정보</h3>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                               {/* 조리 시간 */}
                               <div>
                                   <label className="block mb-1 text-sm dark:text-gray-300">조리 시간 (분)</label>
                                   <input
                                       type="number"
                                       min="1"
                                       value={postData.recipeDetails.cookingTime}
                                       onChange={(e) => handleRecipeDetailChange('cookingTime', parseInt(e.target.value))}
                                       className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                   />
                               </div>
                               
                               {/* 난이도 */}
                               <div>
                                   <label className="block mb-1 text-sm dark:text-gray-300">난이도</label>
                                   <select
                                       value={postData.recipeDetails.difficulty}
                                       onChange={(e) => handleRecipeDetailChange('difficulty', e.target.value)}
                                       className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                   >
                                       <option value="쉬움">쉬움</option>
                                       <option value="보통">보통</option>
                                       <option value="어려움">어려움</option>
                                   </select>
                               </div>
                           </div>
                           
                           {/* 재료 */}
                           <div>
                               <div className="flex justify-between mb-1">
                                   <label className="text-sm dark:text-gray-300">재료</label>
                                   <button
                                       type="button"
                                       onClick={addIngredient}
                                       className="text-blue-500 text-sm hover:text-blue-600"
                                   >
                                       + 재료 추가
                                   </button>
                               </div>
                               
                               {postData.recipeDetails.ingredients.map((ingredient, index) => (
                                   <div key={index} className="flex gap-2 mb-2">
                                       <input
                                           type="text"
                                           value={ingredient.name}
                                           onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                           placeholder="재료명"
                                           className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                       />
                                       <input
                                           type="text"
                                           value={ingredient.amount}
                                           onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                           placeholder="수량"
                                           className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                       />
                                       <button
                                           type="button"
                                           onClick={() => removeIngredient(index)}
                                           className="text-red-500 hover:text-red-600 px-2"
                                       >
                                           ✕
                                       </button>
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}

                   {/* 내용 입력 */}
                   <div className="mb-6">
                       <label className="block mb-2 font-semibold dark:text-white">내용</label>
                       <textarea
                           value={postData.content}
                           onChange={(e) => setPostData({...postData, content: e.target.value})}
                           className="w-full p-4 border rounded-lg h-64 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder={postData.category === 'recipe' 
                              ? "레시피 순서와 팁을 상세히 설명해주세요" 
                              : "내용을 입력하세요"}
                           required
                       />
                   </div>
                   
                   {/* 태그 입력 */}
                   <div className="mb-6">
                       <label className="block mb-2 font-semibold dark:text-white">태그</label>
                       <div className="flex flex-wrap gap-2 mb-2">
                           {postData.tags.map((tag, index) => (
                               <span key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center">
                                   #{tag}
                                   <button
                                       type="button"
                                       onClick={() => removeTag(tag)}
                                       className="ml-2 text-gray-500 hover:text-red-500"
                                   >
                                       ✕
                                   </button>
                               </span>
                           ))}
                       </div>
                       
                       <div className="flex">
                           <input
                               type="text"
                               value={tagInput}
                               onChange={(e) => setTagInput(e.target.value)}
                               placeholder="태그 입력 (최대 5개)"
                               className="flex-1 p-2 border rounded-l-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               disabled={postData.tags.length >= 5}
                           />
                           <button
                               type="button"
                               onClick={handleAddTag}
                               className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400"
                               disabled={!tagInput.trim() || postData.tags.length >= 5}
                           >
                               추가
                           </button>
                       </div>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                           태그는 최대 5개까지 입력할 수 있습니다
                       </p>
                   </div>
                   
                   {/* 이미지 업로드 */}
                   <div className="mb-6">
                       <label className="block mb-2 font-semibold dark:text-white">이미지 첨부</label>
                       
                       {/* 드래그 앤 드롭 영역 */}
                       <div 
                           className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                               ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
                               ${previewImages.length >= 5 ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                           onClick={() => fileInputRef.current.click()}
                           onDragOver={handleDragOver}
                           onDragLeave={handleDragLeave}
                           onDrop={handleDrop}
                       >
                           <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                           </svg>
                           
                           <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">이미지를 여기에 드래그하거나 클릭하여 업로드하세요</p>
                           <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">최대 5개, JPEG, PNG, GIF 파일 지원</p>
                           
                           <input 
                               type="file" 
                               ref={fileInputRef} 
                               className="hidden" 
                               accept="image/*" 
                               multiple 
                               onChange={handleFileSelect}
                               disabled={previewImages.length >= 5}
                           />
                       </div>
                       
                       {/* 이미지 미리보기 */}
                       {previewImages.length > 0 && (
                           <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                               {previewImages.map((preview, index) => (
                                   <div key={index} className="relative group">
                                       <img 
                                           src={preview} 
                                           alt={`미리보기 ${index + 1}`} 
                                           className="w-full h-40 object-cover rounded-lg shadow-sm"
                                       />
                                       <button
                                           type="button"
                                           onClick={() => removeImage(index)}
                                           className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                       >
                                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                           </svg>
                                       </button>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>

                   {/* 버튼 그룹 */}
                   <div className="flex justify-end gap-3">
                       <Button
                           variant="secondary"
                           onClick={() => navigate('/board')}
                           type="button"
                       >
                           취소
                       </Button>
                       <Button
                           type="submit"
                           isLoading={isSubmitting}
                           disabled={isSubmitting}
                       >
                           {isSubmitting ? '저장 중...' : '작성하기'}
                       </Button>
                   </div>
               </form>
           </div>
       </FadeIn>
   )
}

export default BoardWrite