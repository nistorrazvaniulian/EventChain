import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import NavbarMenu from "../../components/user/NavbarMenu";
import EventCard from "../../components/user/EventCard";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events`);
        const data = await res.json();

        // 🔴 Filtrăm evenimentele care nu sunt închise
        const filtered = data.filter(event => !event.isClosed);

        setEvents(filtered);
      } catch (err) {
        console.error('Eroare la preluarea evenimentelor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Header onMenuToggle={() => setMenuOpen(true)} />
      {menuOpen && <NavbarMenu onClose={() => setMenuOpen(false)} />}

      <main className="bg-gray-100 min-h-screen w-full px-4 sm:px-6 md:px-8 pt-20 pb-10">
        <div className="grid gap-6 max-w-[800px] mx-auto">
          {loading ? (
            <p className="text-center text-gray-500">Se încarcă evenimentele...</p>
          ) : (
            events.map(event => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
