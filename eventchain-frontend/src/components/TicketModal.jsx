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

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
      {/* Fundal blurat subtil */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />

      {/* Conținut modal */}
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl z-10 relative"
      >
        {/* Buton ✕ sus dreapta */}
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
          <QRCodeCanvas value={ticket.qrValue} size={120} />
        </div>

        {/* Detalii bilet */}
        <p className="text-center text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
          {ticket.title}
        </p>
        <p className="text-center text-sm text-gray-600">
          {ticket.location}, {ticket.city}
        </p>
        <p className="text-center text-sm text-gray-500">
          {ticket.date}, ora {ticket.time}
        </p>

        {/* Buton Închide */}
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
