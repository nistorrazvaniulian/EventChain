import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryChart from '../../components/manager/CategoryChart';

const API_URL = import.meta.env.VITE_API_URL;

const CategoryPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/manager/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('managerToken')}`
          }
        });

        if (!res.ok) throw new Error('Eroare la încărcarea evenimentelor');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Eroare necunoscută');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <button
        onClick={() => navigate('/manager/dashboard')}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Înapoi la dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">Distribuție pe categorii</h1>

      {loading && <p className="text-gray-500">Se încarcă datele...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <CategoryChart events={events} />
      )}
    </div>
  );
};

export default CategoryPage;
