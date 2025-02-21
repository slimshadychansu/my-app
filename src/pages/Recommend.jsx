function Recommend() {
    // 페이지 제목을 설정합니다
    const pageTitle = "AI 레시피 추천"

    return (
        <div>
            <h1>{pageTitle}</h1>

            {/* AI 추천 시작 섹션 */}
            <section className="recommendation-start">
                <div className="ai-chat">
                    <p className="ai-message">어떤 요리를 해보고 싶으신가요?</p>
                    <p className="ai-message">재료나 상황을 말씀해주시면 맞춤 레시피를 추천해드릴게요!</p>
                </div>

                {/* 사용자 입력 영역 */}
                <div className="user-input">
                    <input 
                        type="text" 
                        placeholder="예) 남은 김치로 뭘 만들까요? 또는 오늘 저녁은 간단하게 해먹고 싶어요"
                        className="recommendation-input"
                    />
                    <button className="ask-button">추천받기</button>
                </div>
            </section>

            {/* 추천 필터 섹션 */}
            <section className="recommendation-filters">
                <h2>상세 조건 설정</h2>
                <div className="filter-options">
                    <div className="filter-group">
                        <h3>조리 시간</h3>
                        <select className="time-filter">
                            <option value="15">15분 이내</option>
                            <option value="30">30분 이내</option>
                            <option value="60">1시간 이내</option>
                            <option value="any">제한 없음</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <h3>난이도</h3>
                        <select className="difficulty-filter">
                            <option value="easy">초급</option>
                            <option value="medium">중급</option>
                            <option value="hard">고급</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <h3>종류</h3>
                        <select className="category-filter">
                            <option value="korean">한식</option>
                            <option value="western">양식</option>
                            <option value="japanese">일식</option>
                            <option value="chinese">중식</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* AI 추천 결과 섹션 */}
            <section className="recommendation-results">
                <h2>맞춤 레시피 추천</h2>
                <div className="recipe-suggestions">
                    {/* 추천 레시피 카드들이 들어갈 자리 */}
                    <div className="recipe-card">
                        <h3>김치볶음밥</h3>
                        <div className="recipe-details">
                            <span>⭐ 난이도: 쉬움</span>
                            <span>⏰ 조리시간: 15분</span>
                            <span>👨‍👩‍👧‍👦 2인분</span>
                        </div>
                        <p className="ai-comment">
                            남은 김치로 만들기 좋은 요리예요. 
                            간단하면서도 맛있는 한 끼가 될 거예요!
                        </p>
                        <button className="view-recipe">레시피 보기</button>
                    </div>

                    <div className="recipe-card">
                        <h3>김치찌개</h3>
                        <div className="recipe-details">
                            <span>⭐ 난이도: 보통</span>
                            <span>⏰ 조리시간: 30분</span>
                            <span>👨‍👩‍👧‍👦 4인분</span>
                        </div>
                        <p className="ai-comment">
                            김치의 맛을 가장 잘 살릴 수 있는 대표 요리입니다. 
                            든든한 한 끼 식사가 될 거예요!
                        </p>
                        <button className="view-recipe">레시피 보기</button>
                    </div>
                </div>
            </section>

            {/* 추가 도움말 섹션 */}
            <section className="help-section">
                <button className="help-button">
                    💡 더 구체적인 조건으로 추천받고 싶으신가요?
                </button>
            </section>
        </div>
    )
}

export default Recommend