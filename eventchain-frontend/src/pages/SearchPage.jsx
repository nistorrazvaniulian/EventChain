import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const navigate = useNavigate();

  const categories = [
    'Concerte',
    'Teatru',
    'Festivaluri',
    'Sport',
    'Stand-up',
    'Copii',
  ];

  return (
    <div className="min-h-screen bg-white w-full px-4 sm:px-6 md:px-8 pt-6 pb-10">
      <div className="max-w-[800px] mx-auto">
        {/* Input + închidere */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Caută eveniment..."
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            className="text-xl text-gray-700"
            onClick={() => navigate('/')}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-6">Ex: Jazz in the Park</p>

        {/* Categorii */}
        <div className="flex flex-col">
          {categories.map(cat => (
            <button
              key={cat}
              className="flex justify-between items-center text-left text-blue-600 px-2 py-4 hover:bg-gray-100"
            >
              {cat}
              <i className="fa-solid fa-angle-right text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
