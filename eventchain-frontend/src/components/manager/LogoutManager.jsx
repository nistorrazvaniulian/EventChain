import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('managerToken');
    navigate('/manager/login');
  }, [navigate]);

  return null;
};

export default LogoutManager;
