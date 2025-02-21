function MyPage() {
    // 페이지 제목과 사용자 정보를 변수로 설정합니다
    const pageTitle = "마이 페이지"
    const userName = "김쉐프" // 나중에는 실제 로그인한 사용자 정보를 가져올 예정입니다

    return (
        <div>
            <h1>{pageTitle}</h1>

            {/* 사용자 프로필 섹션 */}
            <section className="user-profile">
                <div className="profile-header">
                    <h2>안녕하세요, {userName}님!</h2>
                    <button className="edit-profile">프로필 수정</button>
                </div>
                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-label">저장한 레시피</span>
                        <span className="stat-value">12개</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">작성한 게시글</span>
                        <span className="stat-value">5개</span>
                    </div>
                </div>
            </section>

            {/* 저장한 레시피 섹션 */}
            <section className="saved-recipes">
                <h2>저장한 레시피</h2>
                <div className="recipe-grid">
                    <div className="recipe-card">
                        <h3>김치찌개</h3>
                        <div className="recipe-info">
                            <span>⭐ 난이도: 쉬움</span>
                            <span>⏰ 조리시간: 30분</span>
                        </div>
                        <button className="view-recipe">레시피 보기</button>
                    </div>
                    <div className="recipe-card">
                        <h3>파스타</h3>
                        <div className="recipe-info">
                            <span>⭐ 난이도: 보통</span>
                            <span>⏰ 조리시간: 20분</span>
                        </div>
                        <button className="view-recipe">레시피 보기</button>
                    </div>
                </div>
            </section>

            {/* 앱 설정 섹션 */}
            <section className="app-settings">
                <h2>앱 설정</h2>
                <div className="settings-list">
                    <div className="setting-item">
                        <span>음성 안내</span>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <span>푸시 알림</span>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <span>다크 모드</span>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </section>

            {/* AI 학습 데이터 관리 */}
            <section className="ai-preferences">
                <h2>AI 설정</h2>
                <div className="preference-list">
                    <p>선호하는 요리 스타일과 취향을 설정하여 더 정확한 레시피를 추천받으세요.</p>
                    <button className="update-preferences">
                        취향 정보 업데이트
                    </button>
                </div>
            </section>
        </div>
    )
}

export default MyPage