import { useState } from 'react';
import logo from '../assets/Logo.png';
import TicketCard from '../components/TicketCard';
import TicketModal from '../components/TicketModal';
import mockTickets from '../api/mockTickets';

const MyTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);

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

      {/* Lista biletelor */}
      <main className="p-4 space-y-4">
        {mockTickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => setSelectedTicket(ticket)}
          />
        ))}
      </main>

      {/* Modal bilet */}
      <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>
  );
};

export default MyTickets;
