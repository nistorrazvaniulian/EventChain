import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import partyIllustration from '../../assets/undraw_having-fun_kkeu.svg';

const API_URL = import.meta.env.VITE_API_URL;

const ManagerLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/manager/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      // ✅ verificăm dacă e HTML (eroare) în loc de JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Răspuns invalid de la server (nu este JSON)');
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Eroare la autentificare');
        return;
      }

      localStorage.setItem('managerToken', data.token);
      navigate('/manager/dashboard');
    } catch (err) {
      console.error('Eroare:', err);
      setError('Eroare la conectarea cu serverul');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md flex flex-col items-center text-center">
        <img src={partyIllustration} alt="Login manager" className="w-40 sm:w-48 mb-6" />

        <h1 className="text-base sm:text-lg font-medium text-gray-800 mb-4">
          Autentificare necesară pentru organizatori
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm font-medium">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Parolă <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium">{error}</div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow hover:bg-blue-700 transition border-2 border-orange-300 text-sm sm:text-base"
          >
            Autentificare manager
          </button>
        </form>

        <div className="flex flex-col gap-2 text-xs text-gray-500 w-full px-2 mt-6">
          <div className="flex items-start gap-2">
            <span className="text-orange-500">🔒</span>
            <p className="text-left">Accesul este permis doar conturilor manageriale.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">ℹ️</span>
            <p className="text-left">Contactează administratorul pentru date de autentificare.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
