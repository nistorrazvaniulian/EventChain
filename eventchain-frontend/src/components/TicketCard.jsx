import { QRCodeCanvas } from 'qrcode.react';

const TicketCard = ({ ticket, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm flex overflow-hidden cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center justify-center p-4 border-r border-dashed border-gray-300">
        <QRCodeCanvas value={ticket.qrValue} size={64} />
      </div>

      <div className="flex flex-col justify-center p-4 flex-1">
        <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">
          {ticket.title}
        </p>
        <p className="text-sm text-gray-600 leading-tight">
          {ticket.location}, {ticket.city}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {ticket.date}, ora {ticket.time}
        </p>
      </div>
    </div>
  );
};

export default TicketCard;
