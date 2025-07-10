import { useState, useEffect } from 'react';
import logo from '../../assets/Logo.png';
import TicketCard from "../../components/user/TicketCard";
import TicketModal from "../../components/user/TicketModal";

const API_URL = import.meta.env.VITE_API_URL;

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_URL}/users/my-tickets`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!res.ok) {
          throw new Error('Eroare la extragerea biletelor');
        }

        const data = await res.json();

        // ✅ Aici filtrăm biletele fără eveniment asociat
        const validTickets = Array.isArray(data)
          ? data.filter(ticket => ticket.eventId !== null)
          : [];

        setTickets(validTickets);
      } catch (err) {
        console.error(err);
        setError('Nu s-au putut încărca biletele. Încearcă din nou mai târziu.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header doar cu logo */}
      <header className="bg-white px-4 py-3 shadow flex items-center justify-center">
        <button onClick={() => window.location.href = '/'}>
          <img src={logo} alt="EventChain Logo" className="h-10 w-auto" />
        </button>
      </header>

      {/* Tab activ */}
      <nav className="bg-white shadow-inner px-4 py-2">
        <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded">
          Biletele mele
        </button>
      </nav>

      {/* Conținut principal */}
      <main className="p-4 space-y-4">
        {loading && <p className="text-center text-gray-500">Se încarcă biletele...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && tickets.length === 0 && (
          <p className="text-center text-gray-600">Nu ai bilete momentan.</p>
        )}
        {tickets.map(ticket => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            onClick={() => setSelectedTicket(ticket)}
          />
        ))}
      </main>

      {/* Modal pentru bilet selectat */}
      <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>
  );
};

export default MyTickets;
