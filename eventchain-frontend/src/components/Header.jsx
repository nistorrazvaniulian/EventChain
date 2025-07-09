import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/Logo.png';
import categories from '../api/mockCategories';
import cities from '../api/mockCities';
import LogoutModal from "./user/LogoutModal";

const Header = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    navigate('/logout');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow px-4 py-3 sm:px-6 md:px-8">
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {/* ✅ Mobile Header */}
      <div className="flex justify-between items-center lg:hidden">
        <button onClick={handleLogoClick}>
          <img src={logo} alt="EventChain Logo" className="h-10 w-auto" />
        </button>
        <div className="flex items-center gap-4 text-lg text-black">
          <i
            className="fa-solid fa-magnifying-glass cursor-pointer hover:opacity-70 transition"
            onClick={() => navigate('/search')}
          />
          <i
            className="fa-solid fa-bars cursor-pointer hover:opacity-70 transition"
            onClick={onMenuToggle}
          />
        </div>
      </div>

      {/* ✅ Desktop Header */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Logo */}
        <button onClick={handleLogoClick}>
          <img src={logo} alt="EventChain Logo" className="h-10 w-auto" />
        </button>

        {/* Search + Dropdowns */}
        <div className="flex items-center gap-6">
          <input
            type="text"
            placeholder="Caută artist, trupă, locație"
            className="w-[400px] max-w-full px-4 py-2 border rounded text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate('/search');
              }
            }}
          />

          {/* Dropdown Categorii */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredDropdown('categorii')}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
              Categorii
              <i className="fa-solid fa-chevron-down text-xs mt-[1px]" />
            </button>
            {hoveredDropdown === 'categorii' && (
              <div className="absolute top-full left-0 w-48 bg-white border rounded shadow-lg z-50">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate(`/search?category=${cat}`);
                      setHoveredDropdown(null);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Orașe */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredDropdown('orase')}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
              Orașe
              <i className="fa-solid fa-chevron-down text-xs mt-[1px]" />
            </button>
            {hoveredDropdown === 'orase' && (
              <div className="absolute top-full left-0 w-48 bg-white border rounded shadow-lg z-50">
                {cities.map((city) => (
                  <button
                    key={city}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate(`/search?city=${city}`);
                      setHoveredDropdown(null);
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Biletele mele + Logout */}
        <div className="flex items-center gap-6">
          <button
            className={`font-medium text-sm hover:underline ${
              location.pathname === '/my-tickets'
                ? 'text-blue-800 font-semibold'
                : 'text-blue-600'
            }`}
            onClick={() => navigate('/my-tickets')}
          >
            Biletele mele
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => setShowLogoutModal(true)}
          >
            <i className="fa-solid fa-right-from-bracket text-lg" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
