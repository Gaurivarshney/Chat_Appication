import React from 'react';
import Posts from './Posts';

const Feed = () => {
  return (
    <div className="flex-1 my-8 px-4 max-lg:ml-20 sm:px-8 lg:px-16 flex flex-col items-center">
      <Posts />
    </div>
  );
};

export default Feed;
