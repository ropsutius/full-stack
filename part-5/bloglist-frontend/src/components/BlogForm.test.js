import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('Testing BlogForm component', () => {
  let container, mockHandler;

  beforeEach(() => {
    mockHandler = jest.fn();

    container = render(
      <BlogForm addBlog={mockHandler} notify={() => {}} />
    ).container;
  });

  test('Form posts correct information when submitting', async () => {
    const user = userEvent.setup();
    const button = container.querySelector('#add-blog');

    const title = screen.getByPlaceholderText('title');
    const author = screen.getByPlaceholderText('author');
    const url = screen.getByPlaceholderText('url');

    await user.type(title, 'New Title');
    await user.type(author, 'New Author');
    await user.type(url, 'New Url');
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0].title).toBe('New Title');
    expect(mockHandler.mock.calls[0][0].author).toBe('New Author');
    expect(mockHandler.mock.calls[0][0].url).toBe('New Url');
  });
});
