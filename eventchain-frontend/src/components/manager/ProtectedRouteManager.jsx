import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRouteManager = ({ children }) => {
  const token = localStorage.getItem('managerToken');

  if (!token) {
    return <Navigate to="/manager/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'manager') {
      return <Navigate to="/manager/login" replace />;
    }
  } catch (err) {
    console.error('Eroare la decodarea tokenului (manager):', err);
    return <Navigate to="/manager/login" replace />;
  }

  return children;
};

export default ProtectedRouteManager;
