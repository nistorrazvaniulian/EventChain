import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [lei, bani] = event.price?.split('.') ?? ['0', '00'];

  const handleClick = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      {/* Imagine clicabilă */}
      <div className="relative cursor-pointer" onClick={handleClick}>
        <img
          src={event.image}
          alt="eveniment"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-semibold uppercase">
          {event.category}
        </div>
      </div>

      <div className="p-4 flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm mb-1 leading-snug break-words line-clamp-1">
            {event.title}
          </h3>
          <p className="text-gray-600 text-sm leading-tight break-words line-clamp-1">
            {event.location}, {event.city}
          </p>
          <p className="text-gray-500 text-sm">
            {event.date} • {event.time}
          </p>
        </div>
        <div className="flex flex-col items-end flex-shrink-0 text-right">
          <p className="text-sm text-gray-600 mb-1">
            de la <span className="text-sm">{lei}</span>
            <sup className="align-super text-[10px]">{bani}</sup> lei
          </p>
          <button
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
          >
            Vezi detalii
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
