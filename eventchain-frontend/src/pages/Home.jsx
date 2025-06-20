import { useState } from 'react';
import Header from '../components/Header';
import NavbarMenu from '../components/NavbarMenu';
import EventCard from '../components/EventCard';
import events from '../api/mockEvents'; // 🔹 folosim mock extern

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header onMenuToggle={() => setMenuOpen(true)} />
      {menuOpen && <NavbarMenu onClose={() => setMenuOpen(false)} />}

      <main className="bg-gray-100 min-h-screen w-full px-4 sm:px-6 md:px-8 pt-20 pb-10">
        <div className="grid gap-6 max-w-[800px] mx-auto">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
