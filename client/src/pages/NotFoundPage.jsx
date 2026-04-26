import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/login" style={{ marginTop: '1rem', display: 'inline-block' }}>Go back to Login</Link>
    </div>
  );
};

export default NotFoundPage;
