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
          props.blogs.map((b) => (
            <Blog
              key={b.id}
              title={b.title}
              author={b.author}
              url={b.url}
              likes={b.likes}
              user={b.user.username}
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