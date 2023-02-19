import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders content', () => {
  const blog = {
    title: 'maisy',
    author: 'm',
    likes: 0,
    url: 'm',
    user: {},
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText('maisy by m');
  expect(element).toBeDefined();

  //screen.debug(element)

  // const { container } = render(<Blog blog={blog} />);
  // const div = container.querySelector('.blog');
  // expect(div).toHaveTextContent('maisy by m');
});

test('clicking the button calls the handler once', async () => {
  const blog = {
    title: 'maisy',
    author: 'm',
    likes: 0,
    url: 'm',
    user: {},
  };

  // a session is started to interact with the rendered component
  const user = userEvent.setup();

  const mockHandler = jest.fn();

  render(<Blog blog={blog} />);

  // The test finds the button based on the text from the rendered component and clicks the element:
  const button = screen.getByText('View');
  await user.click(button);

  expect(button).toHaveTextContent('Hide');
});
