import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4 text-red-600">404 - Pagina nu a fost găsită</h1>
      <p className="text-gray-700 mb-6">
        Ne pare rău, pagina pe care o cauți nu există.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Înapoi la homepage
      </button>
    </div>
  );
};

export default NotFound;
