import { useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const TicketModal = ({ ticket, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  if (!ticket || !ticket.eventId) return null;

  const event = ticket.eventId;
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('ro-RO');
  const formattedTime = dateObj.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
      {/* Fundal blurat */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />

      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl z-10 relative"
      >
        {/* Buton ✕ */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-xl"
        >
          ✕
        </button>

        {/* Titlu */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Bilet</h2>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <QRCodeCanvas value={ticket.qrCode} size={120} />
        </div>

        {/* Detalii */}
        <p className="text-center text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
          {event.title}
        </p>
        <p className="text-center text-sm text-gray-600">
          {event.location}, {event.city}
        </p>
        <p className="text-center text-sm text-gray-500">
          {formattedDate}, ora {formattedTime}
        </p>

        {/* Buton închidere */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg text-sm"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
