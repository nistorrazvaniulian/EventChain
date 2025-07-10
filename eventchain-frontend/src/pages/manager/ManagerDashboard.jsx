import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaPlus, FaRightFromBracket } from 'react-icons/fa6';
import ManagerStatCard from '../../components/manager/ManagerStatCard';
import ManagerEventCard from '../../components/manager/ManagerEventCard';
import eventCategories from '../../constants/eventCategories';
import cities from '../../constants/cities';

const API_URL = import.meta.env.VITE_API_URL;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showExpired, setShowExpired] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('managerToken');
        const res = await fetch(`${API_URL}/manager/events`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Eroare la încărcarea evenimentelor');
        }

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Eroare necunoscută');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();

  const filteredEvents = events.filter(
    e =>
      (!selectedCity || e.city === selectedCity) &&
      (!selectedCategory || e.category === selectedCategory)
  );

  const activeEvents = filteredEvents.filter(
    e => new Date(e.date) > new Date(now.getTime() - 3 * 60 * 60 * 1000)
  );

  const expiredEvents = filteredEvents.filter(
    e => new Date(e.date) <= new Date(now.getTime() - 3 * 60 * 60 * 1000)
  );

  const totalRevenue = events.reduce((sum, e) => sum + e.ticketsSold * e.price, 0);

  const stats = [
    { label: 'Bilete vândute', value: events.reduce((acc, e) => acc + e.ticketsSold, 0) },
    { label: 'Evenimente create', value: events.length },
    { label: 'Top eveniment', value: events[0]?.title || '–' },
    { label: 'Venit total generat (RON)', value: `${totalRevenue} RON` }
  ];

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="mb-4 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Dashboard Manager</h1>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate('/manager/logout')}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 w-full sm:w-auto transition"
          >
            <FaRightFromBracket /> Logout
          </button>

          <button
            onClick={() => navigate('/manager/create-event')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 border-2 border-orange-300 w-full sm:w-auto transition"
          >
            <FaPlus /> Creează Eveniment
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-600">Se încarcă evenimentele...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {/* Filtre */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm text-gray-600 block mb-1">Filtru oraș:</label>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              >
                <option value="">Toate</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-600 block mb-1">Filtru categorie:</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              >
                <option value="">Toate</option>
                {eventCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistici */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, idx) => (
              <ManagerStatCard key={idx} label={s.label} value={s.value} />
            ))}
          </div>

          {/* Evenimente active */}
          <h2 className="text-xl font-semibold mb-2">Evenimente active</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {activeEvents.map(e => (
              <ManagerEventCard
                key={e._id}
                event={{ ...e, validatedTickets: e.validatedTickets || 0 }}
              />
            ))}
          </div>

          {/* Toggle Evenimente expirate */}
          <h2
            className="text-xl font-semibold mb-2 mt-6 flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setShowExpired(prev => !prev)}
          >
            {showExpired ? '▼' : '▶'} Evenimente expirate
          </h2>

          {showExpired && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {expiredEvents.map(e => (
                <ManagerEventCard
                  key={e._id}
                  event={{ ...e, validatedTickets: e.validatedTickets || 0 }}
                  expired={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;
