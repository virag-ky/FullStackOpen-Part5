/* eslint-disable */
import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
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
        {props.blogs.length &&
          props.blogs
            .map((b) => (
              <Blog
                key={b.id}
                blog={b}
                username={props.user}
                updateBlog={props.updateBlog}
                deleteBlog={props.deleteBlog}
              />
            ))
            .sort((a, b) => {
              if (props.blogs.length > 1) {
                return b.likes - a.likes;
              } else {
                return;
              }
            })}
      </div>
      <div className="togglableContent" style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
