import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'user') {
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error('Eroare la decodarea tokenului:', err);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
