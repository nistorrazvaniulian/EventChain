import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import LoadingOverlay from '../LoadingOverlay';
import { toast } from 'react-toastify';

const ManagerEventCard = ({ event }) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    date,
    city,
    location,
    ticketsSold,
    validatedTickets,
    totalTickets,
    category,
    price
  } = event;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDeleteEvent = async () => {
    setLoadingDelete(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('managerToken')}`, // 🔧 FIX AICI
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Eroare la ștergere');

      toast.success('Eveniment șters cu succes!');
      setShowDeleteModal(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const eventDate = new Date(date);
  const now = new Date();

  const timeUntilStartMs = eventDate - now;
  const hoursToStart = timeUntilStartMs / (1000 * 60 * 60);
  const daysToStart = Math.floor(hoursToStart / 24);

  let startsInText = '';
  if (hoursToStart <= 0) {
    startsInText = null;
  } else if (hoursToStart < 1) {
    startsInText = 'Evenimentul începe în: <1h';
  } else if (hoursToStart < 24) {
    startsInText = `Evenimentul începe în: ${Math.floor(hoursToStart)} ore`;
  } else {
    startsInText = `Evenimentul începe în: ${daysToStart} zile`;
  }

  const formattedDate = eventDate.toLocaleDateString('ro-RO');
  const formattedTime = eventDate.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const validationRate =
    ticketsSold > 0 ? Math.round((validatedTickets / ticketsSold) * 100) : 0;

  const totalRevenue = ticketsSold * price;

  return (
    <>
      <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow duration-200 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Titlu + butoane */}
          <div className="col-span-2 flex items-start justify-between mb-2 gap-2">
            <h4 className="text-base font-bold truncate max-w-[70%]">{title}</h4>
            <div className="flex gap-3 min-w-fit">
              <button
                onClick={() => navigate(`/manager/events/${_id}/edit`)}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:underline flex items-center gap-1"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>

          {/* Coloana 1 */}
          <div className="flex flex-col gap-1 text-gray-700">
            <span>{formattedDate} ora {formattedTime}</span>
            <span>{city}</span>
            <span>{location}</span>
            <span>Categorie: {category}</span>
          </div>

          {/* Coloana 2 */}
          <div className="flex flex-col gap-1 text-gray-700">
            <span>{ticketsSold}/{totalTickets} bilete vândute</span>
            <span>Bilete validate: {validatedTickets} / {ticketsSold}</span>
            <span>Rată validare: {validationRate}%</span>
            <span className="font-semibold">Venit generat: {totalRevenue} RON</span>
          </div>

          {startsInText && (
            <div className="col-span-2 mt-2">
              <p className="text-blue-600 italic">{startsInText}</p>
              <p className="text-xs text-gray-500 mt-1">
                🕒 Evenimentul se va încheia automat la 3h după start
              </p>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteEvent}
        />
      )}

      {loadingDelete && <LoadingOverlay />}
    </>
  );
};

export default ManagerEventCard;
