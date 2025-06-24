import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      setMessage('Parametru eventId lipsă.');
      setLoading(false);
      return;
    }

    // ✅ Verificăm dacă am mai procesat acest bilet deja
    if (localStorage.getItem(`ticket_bought_${eventId}`)) {
      setMessage('Biletul a fost deja generat. Redirecționare...');
      setTimeout(() => navigate('/my-tickets'), 2000);
    } else {
      setMessage('Biletul va fi trimis pe email în scurt timp. Redirecționare...');
      localStorage.setItem(`ticket_bought_${eventId}`, 'true');
      setTimeout(() => navigate('/my-tickets'), 2000);
    }

    setLoading(false);
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4 text-green-600">Plată reușită</h1>
        <p className="text-gray-700 mb-2">{message}</p>
        {loading && <p className="text-sm text-gray-500">Se finalizează plata...</p>}
      </div>
    </div>
  );
};

export default PaymentSuccess;
