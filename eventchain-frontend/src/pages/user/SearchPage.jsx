import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import categories from '../../constants/eventCategories';
import cities from '../../constants/cities';

const API_URL = import.meta.env.VITE_API_URL;

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const cityFilter = searchParams.get('city');

  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // 🔄 Fetch evenimente
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        const data = await res.json();
        setAllEvents(data);
      } catch (err) {
        console.error('Eroare la fetch evenimente:', err);
      }
    };

    fetchEvents();
  }, []);

  // 🧠 Aplicare filtre
  useEffect(() => {
    let filtered = allEvents;

    if (categoryFilter) {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    if (cityFilter) {
      filtered = filtered.filter((e) => e.city === cityFilter);
    }

    filtered = filtered.filter((e) => !e.isClosed);
    setFilteredEvents(filtered);
  }, [categoryFilter, cityFilter, allEvents]);

  // 🔁 Actualizare URL
  const updateSearchParams = (newParams) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) updatedParams.set(key, value);
      else updatedParams.delete(key);
    });
    setSearchParams(updatedParams);
  };

  return (
    <div className="min-h-screen bg-white w-full px-4 sm:px-6 md:px-8 pt-6 pb-10">
      <div className="max-w-[800px] mx-auto">

        {/* 🟦 Categorii */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2">Categorii</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 border rounded-full text-sm ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => updateSearchParams({ category: cat })}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 🟨 Orașe */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2">Orașe</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                className={`px-3 py-1 border rounded-full text-sm ${
                  cityFilter === city
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => updateSearchParams({ city })}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* 🎯 Evenimente */}
        <div className="grid gap-6 mt-10">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className="border rounded p-4 shadow hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {event.city} • {event.category}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Niciun eveniment găsit.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
