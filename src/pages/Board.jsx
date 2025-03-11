import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/animation/PageTransition';
import { FadeIn } from '../components/animation/FadeIn';
import Button from '../components/common/Button';

// 카테고리 데이터
const CATEGORIES = [
    { id: 'all', name: '전체' },
    { id: 'recipe', name: '레시피', color: 'blue' },
    { id: 'daily', name: '일상', color: 'green' },
    { id: 'question', name: '질문', color: 'orange' },
    { id: 'tip', name: '꿀팁', color: 'purple' }
];

// 인기 태그 (예시)
const POPULAR_TAGS = ['한식', '간단요리', '다이어트', '살림꿀팁', '초보요리'];

function Board() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchType, setSearchType] = useState('title');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');
    const postsPerPage = 10;

    // 예시 게시글 데이터
    const [posts] = useState([
        {
            id: 1,
            title: '김치찌개 맛있게 만드는 비법',
            content: '맛있는 김치찌개를 만들기 위한 비법을 공유합니다.',
            author: '요리왕',
            date: '2024-01-06',
            views: 128,
            comments: 15,
            likes: 32,
            category: 'recipe',
            thumbnail: '/src/assets/sample-recipe1.jpg',
            tags: ['한식', '찌개', '김치'],
            recipeDetails: {
                cookingTime: 30,
                difficulty: '쉬움',
                ingredients: [
                    { name: '김치', amount: '1/2포기' },
                    { name: '돼지고기', amount: '300g' },
                    { name: '두부', amount: '1모' }
                ]
            }
        },
        {
            id: 2,
            title: '요즘 자주 만드는 간단 파스타',
            content: '재료도 적게 들고 맛있는 파스타 레시피입니다.',
            author: '파스타마스터',
            date: '2024-01-05',
            views: 85,
            comments: 8,
            likes: 27,
            category: 'recipe',
            thumbnail: '/src/assets/sample-recipe2.jpg',
            tags: ['파스타', '간단요리', '원팬요리'],
            recipeDetails: {
                cookingTime: 15,
                difficulty: '쉬움',
                ingredients: [
                    { name: '스파게티면', amount: '200g' },
                    { name: '올리브오일', amount: '2큰술' },
                    { name: '마늘', amount: '3쪽' }
                ]
            }
        },
        {
            id: 3,
            title: '주방 정리 수납 팁 공유해요',
            content: '좁은 주방을 효율적으로 사용하는 방법을 알려드립니다.',
            author: '정리의달인',
            date: '2024-01-04',
            views: 67,
            comments: 12,
            likes: 19,
            category: 'tip',
            thumbnail: '/src/assets/sample-tip1.jpg',
            tags: ['살림꿀팁', '주방정리', '수납']
        },
        {
            id: 4,
            title: '오늘의 집밥 메뉴',
            content: '오늘 아이들을 위해 만든 집밥 메뉴를 공유합니다.',
            author: '집밥요리사',
            date: '2024-01-03',
            views: 42,
            comments: 5,
            likes: 15,
            category: 'daily',
            thumbnail: '/src/assets/sample-daily1.jpg',
            tags: ['집밥', '가족식사', '일상']
        },
        {
            id: 5,
            title: '전기밥솥으로 빵 만들 수 있나요?',
            content: '전기밥솥으로 빵을 만들고 싶은데 가능할까요? 경험자 답변 부탁드립니다.',
            author: '베이킹초보',
            date: '2024-01-02',
            views: 38,
            comments: 7,
            likes: 3,
            category: 'question',
            tags: ['베이킹', '질문', '전기밥솥']
        },
        // 추가 게시글 데이터
        ...Array(15).fill().map((_, i) => ({
            id: i + 6,
            title: `게시글 제목 ${i + 1}`,
            content: `게시글 내용 ${i + 1}`,
            author: `작성자${i % 5 + 1}`,
            date: '2024-01-01',
            views: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
            likes: Math.floor(Math.random() * 30),
            category: ['recipe', 'daily', 'question', 'tip'][i % 4],
            tags: [POPULAR_TAGS[i % 5]]
        }))
    ]);

    // 게시글 필터링 (카테고리, 검색어, 태그)
    const filterPosts = () => {
        return posts.filter(post => {
            // 카테고리 필터링
            if (activeCategory !== 'all' && post.category !== activeCategory) {
                return false;
            }
            
            // 태그 필터링
            if (selectedTag && (!post.tags || !post.tags.includes(selectedTag))) {
                return false;
            }
            
            // 검색어 필터링
            if (searchKeyword.trim()) {
                if (searchType === 'title') {
                    return post.title.toLowerCase().includes(searchKeyword.toLowerCase());
                } else if (searchType === 'author') {
                    return post.author.toLowerCase().includes(searchKeyword.toLowerCase());
                } else if (searchType === 'content') {
                    return post.content.toLowerCase().includes(searchKeyword.toLowerCase());
                }
            }
            
            return true;
        });
    };

    // 게시글 정렬
    const sortPosts = (filteredPosts) => {
        return [...filteredPosts].sort((a, b) => {
            switch (sortType) {
                case 'latest':
                    return new Date(b.date) - new Date(a.date);
                case 'views':
                    return b.views - a.views;
                case 'comments':
                    return b.comments - a.comments;
                case 'likes':
                    return b.likes - a.likes;
                default:
                    return 0;
            }
        });
    };

    // 필터링 및 정렬된 게시글
    const filteredPosts = filterPosts();
    const sortedPosts = sortPosts(filteredPosts);
    
    // 현재 페이지의 게시글
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
    
    // 총 페이지 수
    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

    // 페이지 변경 시 스크롤 최상단으로
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    // 카테고리에 따른 배지 색상
    const getCategoryBadgeColor = (category) => {
        const categoryObj = CATEGORIES.find(c => c.id === category);
        if (!categoryObj) return 'gray';
        return categoryObj.color;
    };

    // 카테고리 변경 시 페이지 리셋
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    // 태그 클릭 처리
    const handleTagClick = (tag) => {
        if (selectedTag === tag) {
            setSelectedTag('');
        } else {
            setSelectedTag(tag);
        }
        setCurrentPage(1);
    };

    // 검색 실행
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    // 페이지 번호 배열
    const getPageNumbers = () => {
        const pageWindow = 5; // 표시할 페이지 버튼 개수
        const pageNumbers = [];
        
        let startPage = Math.max(1, currentPage - Math.floor(pageWindow / 2));
        let endPage = Math.min(totalPages, startPage + pageWindow - 1);
        
        if (endPage - startPage + 1 < pageWindow) {
            startPage = Math.max(1, endPage - pageWindow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto p-4">
                <FadeIn>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">커뮤니티</h1>
                        <Button 
                            onClick={() => navigate('/board/write')}
                        >
                            글쓰기
                        </Button>
                    </div>
                
                    {/* 카테고리 필터 */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-4 py-2 rounded-full transition-colors ${
                                    activeCategory === category.id
                                        ? `bg-${category.color || 'blue'}-500 text-white`
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                
                    {/* 인기 태그 */}
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">인기 태그</h2>
                        <div className="flex flex-wrap gap-2">
                            {POPULAR_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        selectedTag === tag
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    #{tag}
                                </button>
                            ))}
                            {selectedTag && (
                                <button
                                    onClick={() => setSelectedTag('')}
                                    className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                                >
                                    태그 초기화 ×
                                </button>
                            )}
                        </div>
                    </div>
                </FadeIn>
                
                {/* 정렬 및 검색 */}
                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                    {/* 정렬 옵션 */}
                    <div className="flex-shrink-0">
                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                            className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="latest">최신순</option>
                            <option value="views">조회순</option>
                            <option value="comments">댓글순</option>
                            <option value="likes">좋아요순</option>
                        </select>
                    </div>
                    
                    {/* 검색 */}
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <select 
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                            <option value="author">작성자</option>
                        </select>
                        <input 
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="검색어를 입력하세요"
                            className="flex-1 border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <Button 
                            variant="secondary"
                            type="submit"
                        >
                            검색
                        </Button>
                    </form>
                </div>
                
                {/* 게시글 목록 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
                    {/* 모바일 게시글 목록 (카드 형식) */}
                    <div className="md:hidden">
                        {currentPosts.map(post => (
                            <div 
                                key={post.id}
                                className="border-b dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                onClick={() => navigate(`/board/${post.id}`)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs rounded-full bg-${getCategoryBadgeColor(post.category)}-100 text-${getCategoryBadgeColor(post.category)}-600 dark:bg-${getCategoryBadgeColor(post.category)}-900/30 dark:text-${getCategoryBadgeColor(post.category)}-400`}>
                                            {CATEGORIES.find(c => c.id === post.category)?.name || post.category}
                                        </span>
                                        {post.thumbnail && (
                                            <span className="text-blue-500 text-xs">
                                                📷
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                                </div>
                                
                                <h3 className="font-bold text-gray-800 dark:text-white mb-1">{post.title}</h3>
                                
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.tags && post.tags.map(tag => (
                                        <span key={tag} className="text-xs text-blue-500 dark:text-blue-400">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <span>👁️ {post.views}</span>
                                        <span>💬 {post.comments}</span>
                                        <span>👍 {post.likes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* 데스크톱 게시글 목록 (테이블 형식) */}
                    <div className="hidden md:block">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                                <tr>
                                    <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 w-20">번호</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 w-28">카테고리</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400">제목</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 w-32">작성자</th>
                                    <th className="py-3 px-4 text-right font-medium text-gray-500 dark:text-gray-400 w-32">날짜</th>
                                    <th className="py-3 px-4 text-right font-medium text-gray-500 dark:text-gray-400 w-20">조회</th>
                                    <th className="py-3 px-4 text-right font-medium text-gray-500 dark:text-gray-400 w-20">댓글</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map(post => (
                                    <tr 
                                        key={post.id}
                                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                        onClick={() => navigate(`/board/${post.id}`)}
                                    >
                                        <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{post.id}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-0.5 text-xs rounded-full bg-${getCategoryBadgeColor(post.category)}-100 text-${getCategoryBadgeColor(post.category)}-600 dark:bg-${getCategoryBadgeColor(post.category)}-900/30 dark:text-${getCategoryBadgeColor(post.category)}-400`}>
                                                {CATEGORIES.find(c => c.id === post.category)?.name || post.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                {post.thumbnail && (
                                                    <span className="text-blue-500">
                                                        📷
                                                    </span>
                                                )}
                                                <span className="font-medium text-gray-800 dark:text-white">{post.title}</span>
                                                {post.comments > 0 && (
                                                    <span className="text-sm text-blue-500 dark:text-blue-400">
                                                        [{post.comments}]
                                                    </span>
                                                )}
                                            </div>
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex gap-1 mt-1">
                                                    {post.tags.map(tag => (
                                                        <span key={tag} className="text-xs text-blue-500 dark:text-blue-400">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{post.author}</td>
                                        <td className="py-4 px-4 text-right text-gray-500 dark:text-gray-400">{post.date}</td>
                                        <td className="py-4 px-4 text-right text-gray-500 dark:text-gray-400">{post.views}</td>
                                        <td className="py-4 px-4 text-right text-gray-500 dark:text-gray-400">{post.comments}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* 게시글이 없는 경우 */}
                    {currentPosts.length === 0 && (
                        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
                
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        <button 
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 dark:text-white"
                        >
                            처음
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 dark:text-white"
                        >
                            이전
                        </button>
                        
                        {getPageNumbers().map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === number 
                                    ? 'bg-blue-500 text-white' 
                                    : 'border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                                }`}
                            >
                                {number}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 dark:text-white"
                        >
                            다음
                        </button>
                        <button 
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 dark:text-white"
                        >
                            마지막
                        </button>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}

export default Board;