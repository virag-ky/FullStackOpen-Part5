import './App.css';
import { useState, useEffect, useRef } from 'react';
import blogService from './services/blogs';
import LoginForm from './components/LoginForm';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const blogFormRef = useRef();

  // Load all blogs
  useEffect(() => {
    if (user) {
      const filteredBlogs = blogs.filter(
        (blog) => blog.user.username === username
      );
      setBlogs(filteredBlogs);
    } else {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, []);

  // If there's a user logged in and when we refresh the page, we still get the user data
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    const loggedUserBlogs = window.localStorage.getItem('userBlogs');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      setBlogs(JSON.parse(loggedUserBlogs));
    }
  }, []);

  // Login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      // Set the user data in the local storage
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));

      // Save the user token
      blogService.setToken(user.token);
      setUser(user);

      // Set the filtered blogs in the local storage
      window.localStorage.setItem('userBlogs', JSON.stringify(blogs));

      // Display the filtered blogs
      setBlogs(blogs);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.log(err);
      setMessage('Wrong username or password');
      removeMessage();
    }
  };

  // Log out
  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  // Add a new blog
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    try {
      await blogService.create(blogObject);
      const res = await blogService.getAll();
      setBlogs(res);
    } catch (err) {
      console.log(err);
    }
  };

  // Add likes
  const addLikes = async (blogObject) => {
    try {
      await blogService.update(blogObject.id, blogObject);
    } catch (err) {
      console.log(err);
    }
  };

  // Delete a blog
  const deleteBlog = async (id, blogObject) => {
    try {
      if (
        window.confirm(
          `Remove blog "${blogObject.title}" by ${blogObject.author}?`
        )
      ) {
        await blogService.deleteBlog(id);
        const res = await blogService.getAll();
        setBlogs(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Remove the error or notifications after 5 seconds
  const removeMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  return (
    <div>
      {!user && (
        <Togglable updateBlog={addLikes} blogs={blogs} buttonLabel="Login">
          <Notification message={message} />
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            onChangeUsername={({ target }) => setUsername(target.value)}
            onChangePassword={({ target }) => setPassword(target.value)}
          />
        </Togglable>
      )}
      {user && (
        <div>
          <Notification message={message} />
          <h2>Blogs</h2>
          <p>{user.username} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <Togglable
            user={user.username}
            updateBlog={addLikes}
            deleteBlog={deleteBlog}
            blogs={blogs}
            buttonLabel="New Blog"
            ref={blogFormRef}
          >
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
    </div>
  );
};

export default App;
