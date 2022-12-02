import { useState } from 'react';

const BlogForm = ({ addBlog, notify }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleBlogPost = async (event) => {
    event.preventDefault();

    try {
      await addBlog({ title, author, url });
      setTitle('');
      setAuthor('');
      setUrl('');

      notify(`Blog, titled: ${title} was added`);
    } catch (error) {
      notify(`An Error occurred while adding the blog`, 'alert');
    }
  };

  return (
    <form onSubmit={handleBlogPost}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          placeholder="title"
          id="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          placeholder="author"
          id="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          placeholder="url"
          id="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id="add-blog" type="submit">
        create
      </button>
    </form>
  );
};

export default BlogForm;
