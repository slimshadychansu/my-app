import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardList = React.memo(({ posts }) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 dark:text-gray-400">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">제목</th>
            <th className="py-3 px-4 text-left">작성자</th>
            <th className="py-3 px-4 text-right">날짜</th>
            <th className="py-3 px-4 text-right">조회</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr 
              key={post.id}
              onClick={() => navigate(`/board/${post.id}`)}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="py-3 px-4">{post.title}</td>
              <td className="py-3 px-4">{post.author}</td>
              <td className="py-3 px-4 text-right">{post.date}</td>
              <td className="py-3 px-4 text-right">{post.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default BoardList;