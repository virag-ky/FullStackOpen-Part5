import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>Create new blog:</h2>
      <form id="blog-form" onSubmit={addBlog}>
        <div className="input-container">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <button id="create" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
