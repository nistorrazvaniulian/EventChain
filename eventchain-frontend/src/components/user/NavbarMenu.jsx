import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/Logo.png";
import categories from '../../api/mockCategories';
import cities from '../../api/mockCities';
import LogoutModal from './LogoutModal'; // ✅ Importăm modalul

const NavbarMenu = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Categorii');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState('User'); // ✅ Fallback
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    navigate('/logout');
    onClose();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://eventchain.onrender.com/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Eroare la fetch user');

        const data = await res.json();
        setUserName(data.name);
      } catch (err) {
        console.error('Eroare la obținerea utilizatorului:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
          <img src={logo} alt="EventChain Logo" className="h-10" />
          <i className="fa-solid fa-xmark text-xl cursor-pointer" onClick={onClose} />
        </div>

        {/* Conținut */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {/* Utilizator + logout */}
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-lg font-semibold">{userName}</span>
            <button onClick={() => setShowLogoutModal(true)}>
              <i className="fa-solid fa-right-from-bracket text-xl text-red-600" />
            </button>
          </div>

          {/* Biletele mele */}
          <button
            onClick={() => {
              navigate('/my-tickets');
              onClose();
            }}
            className="flex justify-between items-center text-blue-600 text-base font-medium px-2 py-4 border-b hover:bg-gray-100"
          >
            Biletele mele
            <i className="fa-solid fa-angle-right text-gray-400" />
          </button>

          {/* Taburi */}
          <div className="flex justify-between border-b">
            {['Categorii', 'Orașe'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-1/2 text-center py-2 font-medium ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Listă tab activ */}
          <div className="flex flex-col">
            {(activeTab === 'Categorii' ? categories : cities).map(item => (
              <button
                key={item}
                className="flex justify-between items-center text-left text-gray-700 px-2 py-4 hover:bg-gray-100"
                onClick={() => {
                  navigate(
                    `/search?${activeTab === 'Categorii' ? 'category' : 'city'}=${item}`
                  );
                  onClose();
                }}
              >
                {item}
                <i className="fa-solid fa-angle-right text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMenu;
