import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import NavbarMenu from '../components/NavbarMenu';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import events from '../api/mockEvents';

const EventDetails = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === Number(id));

  const [menuOpen, setMenuOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(prev => !prev);
  };

  const handleBuyClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Funcționalitate în curs de implementare');
    }, 1000);
  };

  const description = `
Get ready for a night like no other as the moon lights up the sky and we light up the dance floor! Introducing FULL MOON PARTY, a brand-new monthly concept at FORM Space, where we celebrate the energy, mystery, and magic of the full moon with electrifying beats and unparalleled vibes.

Starring Alex Super Beats, a powerhouse behind the decks, Alex Super Beats will take you on an unforgettable musical journey, blending pulsating rhythms and hypnotic grooves that will keep you dancing under the moonlit sky all night long.

Join us every month when the full moon rises, and let’s create a night of pure magic together.

This isn’t just a party; it’s a cosmic experience.

An automatic discount of 15% will be awarded if you finalise your payment with a Raiffeisen Premium card and 10% with a Raiffeisen Yellow card. No code is necessary.
This event is 18+ or accompanied by a parent or legal guardian.
Invites available until MIDNIGHT.
`;

  if (!event) {
    return <div className="text-center mt-10 text-red-600">Evenimentul nu a fost găsit.</div>;
  }

  const [lei, bani] = event.price.split('.');

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuToggle={() => setMenuOpen(true)} />
      {menuOpen && <NavbarMenu onClose={() => setMenuOpen(false)} />}

      <img src={event.image} alt="Event" className="w-full h-64 object-cover" />

      <div className="bg-white p-4 shadow-md rounded-b-lg">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h1>

        <div className="flex items-center text-gray-600 mb-1">
          <FaMapMarkerAlt className="mr-2 text-blue-600" />
          <span>{event.location}, {event.city}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <FaClock className="mr-2 text-blue-600" />
          <span>{event.date}, ora {event.time}</span>
        </div>
      </div>

      {/* Card bilet */}
      <div className="bg-white mt-4 p-4 shadow-md rounded-lg mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Acces eveniment</h2>

        <div className="flex items-center justify-between mb-1">
          <p className="text-gray-700 text-base font-medium">
            {lei}
            <sup className="text-xs align-super">{bani}</sup> lei
          </p>

          <button
            className={`${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold px-6 py-2 rounded-full text-sm`}
            onClick={handleBuyClick}
            disabled={isLoading}
          >
            {isLoading ? 'Se procesează...' : 'Cumpără'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-1 italic">
          Organizatorul nu permite returul biletelor.
        </p>
      </div>

      {/* Card detalii */}
      <div className="bg-white mt-4 p-4 shadow-md rounded-lg mx-4 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">Detalii</h2>

        <p className={`text-gray-700 whitespace-pre-line text-sm ${showFullDescription ? '' : 'line-clamp-6'}`}>
          {description}
        </p>

        <button
          onClick={toggleDescription}
          className="mt-2 text-blue-600 font-semibold text-sm focus:outline-none"
        >
          {showFullDescription ? 'Mai puțin' : 'Mai mult'}
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
