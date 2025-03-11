import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../store/atoms';
import CommentSection from '../components/board/CommentSection';
import { PageTransition } from '../components/animation/PageTransition';
import Button from '../components/common/Button';

// 카테고리 데이터
const CATEGORIES = [
    { id: 'all', name: '전체' },
    { id: 'recipe', name: '레시피', color: 'blue' },
    { id: 'daily', name: '일상', color: 'green' },
    { id: 'question', name: '질문', color: 'orange' },
    { id: 'tip', name: '꿀팁', color: 'purple' }
];

// 예시 게시글 데이터
const MOCK_POSTS = [
    {
        id: '1',
        title: '김치찌개 맛있게 만드는 비법',
        content: '맛있는 김치찌개를 만들기 위한 비법을 공유합니다. 먼저, 잘 익은 김치를 사용하는 것이 중요합니다. 김치의 맛이 김치찌개의 맛을 좌우하기 때문입니다.\n\n1. 먼저 냄비에 식용유를 두르고 대파, 마늘을 볶아주세요.\n2. 김치를 넣고 약 3분간 볶아주세요.\n3. 물을 붓고 끓인 후 고기와 두부를 넣어주세요.\n4. 양념을 넣고 20분간 끓이면 완성!\n\n마지막에 대파와 청양고추를 썰어 올려주면 더 맛있게 드실 수 있습니다.',
        author: '요리왕',
        createdAt: '2024-01-06T14:30:00Z',
        views: 245,
        comments: 15,
        likes: 32,
        category: 'recipe',
        images: [
            '/src/assets/sample-recipe1.jpg',
            '/src/assets/sample-recipe2.jpg'
        ],
        tags: ['한식', '찌개', '김치'],
        recipeDetails: {
            cookingTime: 30,
            difficulty: '쉬움',
            ingredients: [
                { name: '김치', amount: '1/2포기' },
                { name: '돼지고기', amount: '300g' },
                { name: '두부', amount: '1모' },
                { name: '대파', amount: '1대' },
                { name: '고춧가루', amount: '1큰술' },
                { name: '간장', amount: '1큰술' }
            ]
        }
    },
    {
        id: '2',
        title: '요즘 자주 만드는 간단 파스타',
        content: '바쁜 아침에도 10분이면 완성하는 간단한 파스타 레시피입니다. 재료도 적게 들고 맛있어요!\n\n면을 삶는 동안 소스를 준비하면 정말 빠르게 완성할 수 있습니다. 마늘과 올리브오일의 향이 정말 좋아요.',
        author: '파스타마스터',
        createdAt: '2024-01-05T10:20:00Z',
        views: 198,
        comments: 8,
        likes: 27,
        category: 'recipe',
        images: [
            '/src/assets/sample-recipe3.jpg'
        ],
        tags: ['파스타', '간단요리', '원팬요리'],
        recipeDetails: {
            cookingTime: 15,
            difficulty: '쉬움',
            ingredients: [
                { name: '스파게티면', amount: '200g' },
                { name: '올리브오일', amount: '2큰술' },
                { name: '마늘', amount: '3쪽' },
                { name: '페페론치노', amount: '1개' },
                { name: '소금', amount: '약간' }
            ]
        }
    },
    {
        id: '3',
        title: '주방 정리 수납 팁 공유해요',
        content: '좁은 주방을 효율적으로 사용하는 방법을 알려드립니다. 주방 용품을 종류별로 구분하고, 자주 사용하는 것은 손이 닿기 쉬운 곳에 배치하세요.\n\n1. 수직 공간 활용하기\n2. 자석 수납 활용하기\n3. 후크와 행거 사용하기\n\n이렇게 하면 좁은 주방도 넓게 사용할 수 있어요!',
        author: '정리의달인',
        createdAt: '2024-01-04T09:15:00Z',
        views: 67,
        comments: 12,
        likes: 19,
        category: 'tip',
        images: [
            '/src/assets/sample-tip1.jpg',
            '/src/assets/sample-tip2.jpg'
        ],
        tags: ['살림꿀팁', '주방정리', '수납']
    },
    {
        id: '4',
        title: '오늘의 집밥 메뉴',
        content: '오늘 아이들을 위해 만든 집밥 메뉴를 공유합니다. 영양도 생각하고 아이들 입맛에 맞게 준비했어요.\n\n오늘의 메뉴는 돼지고기 김치찌개, 멸치볶음, 시금치나물, 계란말이입니다. 아이들이 특히 계란말이를 좋아해서 간식처럼 먹네요.',
        author: '집밥요리사',
        createdAt: '2024-01-03T18:45:00Z',
        views: 42,
        comments: 5,
        likes: 15,
        category: 'daily',
        images: [
            '/src/assets/sample-daily1.jpg'
        ],
        tags: ['집밥', '가족식사', '일상']
    },
    {
        id: '5',
        title: '전기밥솥으로 빵 만들 수 있나요?',
        content: '전기밥솥으로 빵을 만들고 싶은데 가능할까요? 경험자 답변 부탁드립니다. 오븐이 없어서 전기밥솥으로 시도해보려고 하는데, 어떤 종류의 빵이 잘 되는지 궁금합니다.',
        author: '베이킹초보',
        createdAt: '2024-01-02T16:30:00Z',
        views: 38,
        comments: 7,
        likes: 3,
        category: 'question',
        tags: ['베이킹', '질문', '전기밥솥']
    }
];

function BoardDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    
    // 게시글 데이터 로드
    useEffect(() => {
        const fetchPost = () => {
            setIsLoading(true);
            // 실제 API 연동 시 여기에 API 호출 코드 작성
            
            // 임시 데이터 사용
            const foundPost = MOCK_POSTS.find(post => post.id === id);
            
            if (foundPost) {
                setTimeout(() => {
                    setPost(foundPost);
                    setIsLoading(false);
                }, 500);
            } else {
                navigate('/board');
            }
        };
        
        fetchPost();
    }, [id, navigate]);
    
    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };
    
    // 게시글 좋아요 토글
    const handleLikeToggle = () => {
        if (!user.isLoggedIn) {
            alert('로그인 후 이용해주세요.');
            return;
        }
        
        setLiked(!liked);
        setPost(prev => ({
            ...prev,
            likes: liked ? prev.likes - 1 : prev.likes + 1
        }));
    };
    
    // 글 수정 페이지로 이동
    const handleEdit = () => {
        navigate(`/board/edit/${id}`);
    };
    
    // 글 삭제 처리
    const handleDelete = () => {
        if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
            // API 호출하여 삭제 처리 (실제 구현 필요)
            alert('게시글이 삭제되었습니다.');
            navigate('/board');
        }
    };
    
    // 이미지 갤러리 관련 함수
    const [showLightbox, setShowLightbox] = useState(false);
    
    // 이전 이미지 보기
    const showPrevImage = () => {
        if (!post || !post.images || post.images.length <= 1) return;
        setActiveImageIndex(prev => 
            prev === 0 ? post.images.length - 1 : prev - 1
        );
    };
    
    // 다음 이미지 보기
    const showNextImage = () => {
        if (!post || !post.images || post.images.length <= 1) return;
        setActiveImageIndex(prev => 
            prev === post.images.length - 1 ? 0 : prev + 1
        );
    };
    
    // 카테고리에 따른 배지 색상
    const getCategoryBadgeColor = (category) => {
        const categoryObj = CATEGORIES.find(c => c.id === category);
        if (!categoryObj) return 'gray';
        return categoryObj.color;
    };
    
    // 내용에 줄바꿈 적용
    const formatContent = (content) => {
        return content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };
    
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    {/* 게시글 헤더 */}
                    <div className="p-6 border-b dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full bg-${getCategoryBadgeColor(post.category)}-100 text-${getCategoryBadgeColor(post.category)}-600 dark:bg-${getCategoryBadgeColor(post.category)}-900/30 dark:text-${getCategoryBadgeColor(post.category)}-400`}>
                                {CATEGORIES.find(c => c.id === post.category)?.name || post.category}
                            </span>
                            
                            {/* 태그 */}
                            {post.tags && post.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        
                        <h1 className="text-2xl font-bold mb-3 dark:text-white">{post.title}</h1>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                                <span>작성자: {post.author}</span>
                                <span>작성일: {formatDate(post.createdAt)}</span>
                                <span>조회수: {post.views}</span>
                            </div>
                            {post.author === user.name && (
                                <div className="space-x-2">
                                    <button 
                                        onClick={handleEdit}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        수정
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* 레시피 정보 (레시피 카테고리인 경우에만) */}
                    {post.category === 'recipe' && post.recipeDetails && (
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b dark:border-gray-700">
                            <h2 className="text-xl font-bold mb-4 dark:text-white">레시피 정보</h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">조리 시간</h3>
                                    <p className="text-lg font-bold dark:text-white">{post.recipeDetails.cookingTime}분</p>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">난이도</h3>
                                    <p className="text-lg font-bold dark:text-white">{post.recipeDetails.difficulty}</p>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">재료 개수</h3>
                                    <p className="text-lg font-bold dark:text-white">{post.recipeDetails.ingredients.length}가지</p>
                                </div>
                            </div>
                            
                            {/* 재료 목록 */}
                            <div>
                                <h3 className="text-lg font-medium mb-3 dark:text-white">재료</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {post.recipeDetails.ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex justify-between p-2 bg-white dark:bg-gray-700 rounded-lg">
                                            <span className="font-medium dark:text-white">{ingredient.name}</span>
                                            <span className="text-gray-600 dark:text-gray-300">{ingredient.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 이미지 갤러리 (이미지가 있는 경우만 표시) */}
                    {post.images && post.images.length > 0 && (
                        <div className="p-6 border-b dark:border-gray-700">
                            <div className="relative aspect-video mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <img
                                    src={post.images[activeImageIndex]}
                                    alt={`${post.title} 이미지 ${activeImageIndex + 1}`}
                                    className="w-full h-full object-contain cursor-pointer"
                                    onClick={() => setShowLightbox(true)}
                                />
                                
                                {/* 이미지가 여러장일 때만 네비게이션 표시 */}
                                {post.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={showPrevImage}
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={showNextImage}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </>
                                )}
                                
                                {/* 이미지 인디케이터 */}
                                {post.images.length > 1 && (
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {post.images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-colors ${
                                                    index === activeImageIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-60'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* 섬네일 리스트 (이미지가 여러 장일 경우만) */}
                            {post.images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {post.images.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden ${
                                                index === activeImageIndex ? 'ring-2 ring-blue-500' : 'border border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${post.title} 썸네일 ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* 게시글 본문 */}
                    <div className="p-6 border-b dark:border-gray-700">
                        <div className="prose max-w-none dark:prose-invert">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                                {formatContent(post.content)}
                            </p>
                        </div>
                    </div>
                    
                    {/* 좋아요 버튼 */}
                    <div className="p-6 flex justify-center border-b dark:border-gray-700">
                        <button 
                            onClick={handleLikeToggle}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                                liked 
                                    ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            }`}
                        >
                            <svg 
                                className="w-6 h-6" 
                                fill={liked ? 'currentColor' : 'none'} 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                ></path>
                            </svg>
                            좋아요 {post.likes + (liked ? 1 : 0)}
                        </button>
                    </div>
                    
                    {/* 목록으로 돌아가기 버튼 */}
                    <div className="p-6 flex justify-between">
                        <Button 
                            variant="secondary"
                            onClick={() => navigate('/board')}
                        >
                            목록으로
                        </Button>
                        
                        {post.category === 'recipe' && (
                            <Button 
                                onClick={() => navigate('/guide', { state: { recipe: {
                                    title: post.title,
                                    steps: [
                                        { instruction: '재료를 준비합니다.', timer: 0 },
                                        { instruction: '조리를 시작합니다.', timer: post.recipeDetails.cookingTime * 30 },
                                        { instruction: '완성했습니다. 맛있게 드세요!', timer: 0 }
                                    ]
                                }}})}
                            >
                                요리 시작하기
                            </Button>
                        )}
                    </div>
                    
                    {/* 댓글 섹션 */}
                    <CommentSection postId={id} />
                </div>
                
                {/* 이미지 라이트박스 */}
                {showLightbox && post.images && (
                    <div 
                        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
                        onClick={() => setShowLightbox(false)}
                    >
                        <div 
                            className="max-w-6xl max-h-screen p-4 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* 닫기 버튼 */}
                            <button
                                onClick={() => setShowLightbox(false)}
                                className="absolute top-2 right-2 text-white z-10 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                            
                            {/* 이미지 */}
                            <img
                                src={post.images[activeImageIndex]}
                                alt={`${post.title} 이미지 ${activeImageIndex + 1}`}
                                className="max-h-[90vh] max-w-full mx-auto object-contain"
                            />
                            
                            {/* 이미지 네비게이션 */}
                            {post.images.length > 1 && (
                                <>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            showPrevImage();
                                        }}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-opacity"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            showNextImage();
                                        }}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-opacity"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </>
                            )}
                            
                            {/* 이미지 카운터 */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                                {activeImageIndex + 1} / {post.images.length}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}

export default BoardDetail;