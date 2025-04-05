import { atom } from 'recoil';

// 게시글 댓글 상태 관리
export const commentsState = atom({
  key: 'commentsState',
  default: [
    // 예시 댓글 데이터
    {
      id: 'comment1',
      postId: 'post1',
      author: '요리왕',
      content: '이 레시피 정말 맛있어요! 감사합니다.',
      createdAt: '2023-01-15T14:30:00Z'
    },
    {
      id: 'comment2',
      postId: 'post1',
      author: '초보쿡',
      content: '재료를 대체할 수 있는 방법이 있을까요?',
      createdAt: '2023-01-15T16:45:00Z'
    },
    {
      id: 'comment3',
      postId: 'post2',
      author: '건강식탐험가',
      content: '칼로리 정보도 알려주시면 좋을 것 같아요!',
      createdAt: '2023-01-16T09:15:00Z'
    }
  ]
});