import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import NavbarMenu from '../components/NavbarMenu';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const EventDetails = () => {
  const { id } = useParams();
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const imageBaseUrl = import.meta.env.VITE_IMAGE_URL;

  const [event, setEvent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/events`);
        const data = await res.json();
        const selected = data.find(e => e._id === id);
        setEvent(selected);
      } catch (err) {
        console.error('Eroare la fetch:', err);
      }
    };

    fetchEvent();
  }, [id, apiBaseUrl]);

  const toggleDescription = () => setShowFullDescription(prev => !prev);

  const handleBuyClick = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          title: event.title,
          price: event.price,
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        if (data.error === 'Ai deja un bilet pentru acest eveniment.') {
          alert('⚠️ Ai deja un bilet pentru acest eveniment.');
        } else {
          alert(data.error || 'Eroare la inițializarea plății');
        }
      }
    } catch (err) {
      console.error('Eroare la cumpărare:', err);
      alert('A apărut o eroare. Încearcă din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return <div className="text-center mt-10 text-red-600">Evenimentul nu a fost găsit.</div>;
  }

  const [lei, bani] = String(event.price ?? '0.00').split('.');
  const imageUrl = `${imageBaseUrl}/${event.image}`;
  const description = event.description || `Get ready for a night like no other...`;

  const rawDate = new Date(event.date);
  const weekday = rawDate.toLocaleDateString('ro-RO', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const formattedDate = `${capitalizedWeekday}, ${rawDate.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })}, ora ${rawDate.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  return (
    <div className="min-h-screen bg-gray-100 pt-[80px]">
      <Header onMenuToggle={() => setMenuOpen(true)} />
      {menuOpen && <NavbarMenu onClose={() => setMenuOpen(false)} />}

      {/* DESIGN MOBIL */}
      <div className="md:hidden mt-4 px-4">
        <img src={imageUrl} alt="Event" className="w-full h-64 object-cover rounded-lg mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h1>
        <div className="flex items-center text-gray-600 mb-1">
          <FaMapMarkerAlt className="mr-2 text-blue-600" />
          <span>{event.location}, {event.city}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FaClock className="mr-2 text-blue-600" />
          <span>{formattedDate}</span>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Acces eveniment</h2>
          <div className="flex items-center justify-between mb-1">
            <p className="text-gray-700 text-base font-medium">
              {lei}<sup className="text-xs align-super">{bani}</sup> lei
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

        <div className="bg-white p-4 shadow-md rounded-lg mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">Detalii</h2>
          <p className={`text-gray-700 whitespace-pre-line text-sm ${showFullDescription ? '' : 'line-clamp-6'}`}>
            {description}
          </p>
          {description.length > 240 && (
            <button
              onClick={toggleDescription}
              className="mt-2 text-blue-600 font-semibold text-sm focus:outline-none"
            >
              {showFullDescription ? 'Mai puțin' : 'Mai mult'}
            </button>
          )}
        </div>
      </div>

      {/* DESIGN DESKTOP */}
      <div className="hidden md:flex md:flex-col md:items-center md:mt-10 md:pb-10">
        <div className="bg-white p-6 rounded-lg shadow-md md:max-w-6xl md:w-full">
          <div className="flex gap-10">
            <img
              src={imageUrl}
              alt="Event"
              className="w-[360px] h-[460px] object-cover rounded-lg shadow"
            />
            <div className="flex flex-col justify-start flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex items-center text-gray-700 mb-2 text-lg">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                <span>{event.location}, {event.city}</span>
              </div>
              <div className="flex items-center text-gray-700 mb-4 text-lg">
                <FaClock className="mr-2 text-blue-600" />
                <span>{formattedDate}</span>
              </div>

              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-10 p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acces eveniment</h2>
          <p className="text-gray-700 text-base mb-3">
            Accesul oferă intrarea la eveniment pentru data selectată. Biletul este valabil o singură dată și permite accesul unei singure persoane.
            Vă rugăm să ajungeți cu cel puțin 15 minute înainte de începerea evenimentului. Copiii pot avea nevoie de bilet separat, în funcție de politica organizatorului.
          </p>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-800 text-3xl font-bold">
              {lei}<sup className="text-lg align-super">{bani}</sup> lei
            </p>
            <button
              className={`${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-semibold px-10 py-3 rounded-full text-base`}
              onClick={handleBuyClick}
              disabled={isLoading}
            >
              {isLoading ? 'Se procesează...' : 'Cumpără'}
            </button>
          </div>
          <p className="text-xs text-gray-500 italic">Biletele nu sunt returnabile</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
