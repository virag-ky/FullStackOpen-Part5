import { useState } from 'react';

const Blog = ({ title, author, url, likes, user }) => {
  const [show, setShow] = useState(false);
  const buttonText = show ? 'Hide' : 'View';

  return (
    <div id="blog-container">
      <span>
        {title} by {author}
      </span>
      {show && (
        <>
          <span>{url}</span>
          <span>Likes: {likes}</span>
          <span>{user}</span>
        </>
      )}

      <button onClick={() => setShow(!show)}>{buttonText}</button>
    </div>
  );
};

export default Blog;
