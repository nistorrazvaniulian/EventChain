import { QRCodeCanvas } from 'qrcode.react';

const TicketCard = ({ ticket, onClick }) => {
  const event = ticket.eventId;

  // Dacă evenimentul nu mai există (a fost șters)
  if (!event) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        Acest bilet este asociat unui eveniment care a fost șters.
      </div>
    );
  }

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('ro-RO');
  const formattedTime = dateObj.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm flex overflow-hidden cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center justify-center p-4 border-r border-dashed border-gray-300">
        <QRCodeCanvas value={ticket.qrCode} size={64} />
      </div>

      <div className="flex flex-col justify-center p-4 flex-1">
        <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">
          {event.title}
        </p>
        <p className="text-sm text-gray-600 leading-tight">
          {event.location}, {event.city}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {formattedDate}, ora {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default TicketCard;
