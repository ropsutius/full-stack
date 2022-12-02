//import react from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const user = { username: 'matti123', name: 'Matti Teppo', id: 123 };
const blog = {
  title: 'Title',
  author: 'Author',
  url: 'www.url.com',
  user: user,
};

describe('Testing Blog component', () => {
  let container, mockHandler;

  beforeEach(() => {
    mockHandler = jest.fn();

    container = render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={mockHandler}
        removeBlog={() => {}}
        notify={() => {}}
        handle
      />
    ).container;
  });

  test('Title and Author are shown when the component is created', async () => {
    await screen.getByText('Title', { exact: false });
    await screen.getByText('Author', { exact: false });

    const hidden = container.querySelector('.hidden-info');
    expect(hidden).toHaveStyle('display: none');
  });

  test('Url and Likes are shown after `show` button is clicked', async () => {
    const user = userEvent.setup();
    const button = container.querySelector('#toggle-visibility');

    await user.click(button);

    const hidden = container.querySelector('.hidden-info');
    expect(hidden).not.toHaveStyle('display:none');
  });

  test('Url and Likes are shown after `show` button is clicked', async () => {
    const user = userEvent.setup();
    const button = container.querySelector('#add-like');

    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
