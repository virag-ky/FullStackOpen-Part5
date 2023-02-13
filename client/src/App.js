import './App.css';
import { useState, useEffect } from 'react';
import blogService from './services/blogs';
import LoginForm from './components/LoginForm';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Blog from './components/Blog';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loginVisible, setLoginVisible] = useState(false);

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
    setLoginVisible(false);

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

  const addBlog = async (event) => {
    event.preventDefault();
    const addedBlog = { title, author, url };
    const userObj = window.localStorage.getItem('loggedBlogAppUser');
    const parsedUserObj = JSON.parse(userObj);

    window.localStorage.removeItem('userBlogs');

    try {
      await blogService.create(addedBlog);
      const res = await blogService.getAll();

      const filteredBlogs = res.filter(
        (blog) => blog.user.username === parsedUserObj.username
      );

      window.localStorage.setItem('userBlogs', JSON.stringify(filteredBlogs));

      setUserBlogs(filteredBlogs);
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleBlogChange = ({ target }) => {
    if (target.name === 'title') {
      setTitle(target.value);
    } else if (target.name === 'author') {
      setAuthor(target.value);
    } else {
      setUrl(target.value);
    }
  };

  const removeMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' };
    const showWhenVisible = { display: loginVisible ? '' : 'none' };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
          {blogs.map((blog) => (
            <Blog key={blog.id} title={blog.title} author={blog.author} />
          ))}
        </div>
        <div style={showWhenVisible}>
          <Notification message={message} />
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            onChangeUsername={({ target }) => setUsername(target.value)}
            onChangePassword={({ target }) => setPassword(target.value)}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <Notification message={message} />
          <BlogForm
            addBlog={addBlog}
            username={user.username}
            blogs={userBlogs}
            title={title}
            author={author}
            url={url}
            handleBlogChange={handleBlogChange}
            handleLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
};

export default App;
