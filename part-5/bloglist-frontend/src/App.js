import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const noteFormRef = useRef();

  useEffect(() => {
    const getAllBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };
    getAllBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('bloggingServiceUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blog) => {
    const newBlog = await blogService.addBlog(blog);
    setBlogs(blogs.concat(newBlog));
    noteFormRef.current.toggleVisibility();
  };

  const updateBlog = async (blog) => {
    const updatedBlog = await blogService.updateBlog(blog);
    setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)));
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.removeBlog(blog);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
    }
  };

  const login = async (creds) => {
    const loggedInUser = await loginService.login(creds);

    window.localStorage.setItem(
      'bloggingServiceUser',
      JSON.stringify(loggedInUser)
    );

    blogService.setToken(loggedInUser.token);
    setUser(loggedInUser);
  };

  const notify = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLogout = () => {
    notify(`${user.name} has logged out`);
    window.localStorage.removeItem('bloggingServiceUser');
    setUser(null);
  };

  return (
    <div>
      <h1>Blogging Service</h1>
      <Notification notification={notification} />
      {user === null ? (
        <div>
          <Togglable buttonLabel={'login'}>
            <h2>log in to service</h2>
            <LoginForm login={login} notify={notify} />
          </Togglable>
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel={'new note'} ref={noteFormRef}>
            <BlogForm addBlog={addBlog} notify={notify} />
          </Togglable>

          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                removeBlog={removeBlog}
                notify={notify}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
