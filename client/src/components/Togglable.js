import { useState, forwardRef, useImperativeHandle } from 'react';
import Blog from './Blog';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => setVisible(!visible);
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        {props.blogs &&
          props.blogs
            .sort((a, b) => b.likes - a.likes)
            .map((b) => (
              <Blog
                key={b.id}
                blog={b}
                username={props.user}
                updateBlog={props.updateBlog}
              />
            ))}
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  );
});

export default Togglable;
