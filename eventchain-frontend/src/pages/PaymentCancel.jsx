import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');

  const handleBackClick = () => {
    if (eventId) {
      navigate(`/event/${eventId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">Plată anulată</h1>
        <p className="text-gray-700 mb-4">
          Plata a fost întreruptă sau anulată. Biletul nu a fost cumpărat.
        </p>
        <button
          onClick={handleBackClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
        >
          Înapoi la eveniment
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
