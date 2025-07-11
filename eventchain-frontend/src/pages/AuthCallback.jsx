import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);

      // Eliminăm tokenul din URL
      window.history.replaceState(null, '', window.location.pathname);

      // Așteptăm un pic pentru ca ProtectedRoute să-l vadă
      setTimeout(() => {
        navigate('/');
      }, 100); // delay
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="h-screen flex justify-center items-center text-gray-700 text-lg">
      Se verifică autentificarea...
    </div>
  );
};

export default AuthCallback;
