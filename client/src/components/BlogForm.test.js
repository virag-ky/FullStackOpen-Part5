import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const inputTitle = screen.getByLabelText('Title:');
  const inputAuthor = screen.getByLabelText('Author:');
  const inputUrl = screen.getByLabelText('URL:');
  const createButton = screen.getByText('Create');

  await user.type(inputTitle, 'testing a form...');
  await user.type(inputAuthor, "author's name");
  await user.type(inputUrl, 'url of blog');
  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...');
});
