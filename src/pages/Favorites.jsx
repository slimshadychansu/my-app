// src/pages/Favorites.jsx
import React from 'react'
import { useRecoilValue } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { favoritesState } from '../store/atoms'

function Favorites() {
    const favorites = useRecoilValue(favoritesState)
    const navigate = useNavigate()

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">즐겨찾기한 레시피</h1>
            
            {favorites.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    아직 즐겨찾기한 레시피가 없습니다.
                </div>
            ) : (
                <div className="grid gap-4">
                    {favorites.map((recipe, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold text-lg">{recipe.title}</h3>
                            </div>
                            <button
                                onClick={() => navigate('/guide', { state: { recipe }})}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                레시피 보기
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favorites