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
  const [userBlogs, setUserBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    const loggedUserBlogs = window.localStorage.getItem('userBlogs');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      setUserBlogs(JSON.parse(loggedUserBlogs));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);

      const filteredBlogs = blogs.filter(
        (blog) => blog.user.username === username
      );

      window.localStorage.setItem('userBlogs', JSON.stringify(filteredBlogs));

      setUserBlogs(filteredBlogs);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage('Wrong username or password');
      removeMessage();
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const userObj = window.localStorage.getItem('loggedBlogAppUser');
    const parsedUserObj = JSON.parse(userObj);

    window.localStorage.removeItem('userBlogs');

    try {
      await blogService.create(blogObject);
      const res = await blogService.getAll();

      const filteredBlogs = res.filter(
        (blog) => blog.user.username === parsedUserObj.username
      );

      window.localStorage.setItem('userBlogs', JSON.stringify(filteredBlogs));

      setUserBlogs(filteredBlogs);
    } catch (exception) {
      console.log(exception);
    }
  };

  const removeMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  return (
    <div>
      {!user && (
        <Togglable blogs={blogs} buttonLabel="Login">
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
          <Togglable blogs={userBlogs} buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
    </div>
  );
};

export default App;
