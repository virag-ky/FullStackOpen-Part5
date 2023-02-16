import { useState } from 'react';

const Blog = ({ blog, updateBlog, deleteBlog, username }) => {
  const [show, setShow] = useState(false);
  const [userLikes, setUserLikes] = useState(blog.likes);
  const buttonText = show ? 'Hide' : 'View';

  const updatedBlogWithLikes = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    user: blog.user.id,
    id: blog.id,
    likes: userLikes + 1,
  };

  const addLike = () => {
    setUserLikes(userLikes + 1);
    updateBlog(updatedBlogWithLikes);
  };

  return (
    <div id="blog-container">
      <div>
        <span>
          {blog.title} by {blog.author}
        </span>
        {show && (
          <div id="extra-info">
            <span>{blog.url}</span>
            <div>
              <span>Likes: {userLikes}</span>
              <button onClick={addLike}>Like</button>
            </div>
            <span>{blog.user.username}</span>
            {blog.user.username === username ? (
              <button onClick={() => deleteBlog(blog.id, blog)}>Remove</button>
            ) : (
              ''
            )}
          </div>
        )}
      </div>
      <button onClick={() => setShow(!show)}>{buttonText}</button>
    </div>
  );
};

export default Blog;
