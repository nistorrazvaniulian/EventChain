import { useState } from 'react';
import Header from '../components/Header';
import NavbarMenu from '../components/NavbarMenu';
import EventCard from '../components/EventCard';

const events = [
  {
    id: 1,
    title: 'Jazz in the Park',
    date: '9–13 Iulie',
    time: '19:30',
    location: 'Opera Națională',
    city: 'București',
    image: 'https://picsum.photos/400/200?random=1',
    category: 'Festival',
    price: '39.99'
  },
  {
    id: 2,
    title: 'Concert experimental cu nume foarte lung care se întinde pe mai multe rânduri și trebuie să fie afișat corect fără să strice designul',
    date: '20–21 Iulie',
    time: '18:00',
    location: 'Parcul Central extrem de lung cu denumire artistică neobișnuit de detaliată și poetică',
    city: 'Cluj-Napoca orașul luminilor și al evenimentelor culturale diverse și inovatoare',
    image: 'https://picsum.photos/400/200?random=2',
    category: 'Concert',
    price: '59.99'
  },
  {
    id: 3,
    title: 'Techno Night',
    date: '30 August',
    time: '22:00',
    location: 'Sala Polivalentă',
    city: 'Iași',
    image: 'https://picsum.photos/400/200?random=3',
    category: 'Party',
    price: '49.99'
  }
];

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
