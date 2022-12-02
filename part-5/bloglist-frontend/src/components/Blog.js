import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateBlog, removeBlog, notify, user }) => {
  const [visible, setVisibility] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const isUser = blog.user.id === user.id;
  const showWhenUser = { display: isUser ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };
  const buttonLabel = visible ? 'hide' : 'view';

  const handleLike = async () => {
    try {
      const blogToUpdate = {
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      };
      await updateBlog(blogToUpdate);
    } catch (error) {
      notify('Could not like blog', 'alert');
    }
  };

  const handleRemove = async () => {
    try {
      await removeBlog(blog);
    } catch (error) {
      notify('Could not remove blog', 'alert');
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button id="toggle-visibility" onClick={() => setVisibility(!visible)}>
          {buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible} className="hidden-info">
        <span>{blog.url}</span>
        <br />
        <span>
          likes <span className="likes">{blog.likes}</span>{' '}
          <button id="add-like" onClick={handleLike}>
            like
          </button>
        </span>
        <br />
        <span>{blog.user.name}</span>
        <button style={showWhenUser} onClick={handleRemove}>
          remove
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
