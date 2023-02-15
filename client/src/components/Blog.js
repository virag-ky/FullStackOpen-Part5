import { useState } from 'react';

const Blog = ({ title, author, url, likes, user }) => {
  const [show, setShow] = useState(false);
  const buttonText = show ? 'Hide' : 'View';

  return (
    <div id="blog-container">
      <div>
        <span>
          {title} by {author}
        </span>
        {show && (
          <div id="extra-info">
            <span>{url}</span>
            <span>Likes: {likes}</span>
            <span>{user}</span>
          </div>
        )}
      </div>
      <button onClick={() => setShow(!show)}>{buttonText}</button>
    </div>
  );
};

export default Blog;
