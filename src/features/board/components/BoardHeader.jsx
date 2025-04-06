import React from 'react';
import Button from '../../../components/common/Button';

const BoardHeader = React.memo(({ title, onWriteClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold dark:text-white">{title}</h1>
      <Button onClick={onWriteClick}>글쓰기</Button>
    </div>
  );
});

export default BoardHeader;