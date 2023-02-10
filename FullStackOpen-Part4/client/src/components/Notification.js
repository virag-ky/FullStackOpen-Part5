const Notification = ({ message }) => {
  if (message === '') {
    return <div id="notification-container"></div>;
  }
  return (
    <div id="notification-container">
      <p id="notification">{message}</p>
    </div>
  );
};

export default Notification;
