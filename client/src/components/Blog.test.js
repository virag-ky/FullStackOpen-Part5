import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
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

  // const { container } = render(<Blog blog={blog} />);
  // const div = container.querySelector('.blog');
  // expect(div).toHaveTextContent('maisy by m');
});
