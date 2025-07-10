import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from "../../components/LoadingOverlay";
import eventCategories from '../../constants/eventCategories';
import cities from '../../constants/cities';
import locations from '../../constants/locations';

const CreateEvent = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    totalTickets: '',
    location: '',
    city: '',
    category: '',
    price: '',
    image: null
  });

  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .loader {
        border: 4px solid #e5e7eb;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        animation: spin 0.8s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImageName(file?.name || '');
    } else {
      if (name === 'city') {
        setFormData({ ...formData, city: value, location: '' }); // resetăm locația dacă se schimbă orașul
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmptyField = Object.values(formData).some(val => !val);
    if (isEmptyField || !formData.image) {
      toast.error('Toate câmpurile sunt obligatorii.');
      return;
    }

    if (Number(formData.price) <= 0 || Number(formData.totalTickets) <= 0) {
      toast.error('Prețul și numărul de bilete trebuie să fie mai mari decât 0.');
      return;
    }

    const eventDate = new Date(formData.date);
    const now = new Date();
    if (eventDate <= now) {
      toast.error('Data evenimentului trebuie să fie în viitor.');
      return;
    }

    const token = localStorage.getItem('managerToken');
    if (!token) {
      toast.error('Nu ești autentificat.');
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => form.append(key, val));

      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        toast.error(data.error || 'Eroare la creare eveniment.');
      } else {
        toast.success('Eveniment creat cu succes!');
        setTimeout(() => navigate('/manager/dashboard'), 500);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error('A apărut o eroare. Încearcă din nou.');
    }
  };

  const availableLocations = locations[formData.city] || [];

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-50 p-6 rounded shadow relative">
      <h2 className="text-2xl font-semibold mb-6">Creează Eveniment</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Titlu */}
        <div>
          <label className="block font-medium mb-1">Titlul evenimentului <span className="text-red-500">*</span></label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>

        {/* Descriere */}
        <div>
          <label className="block font-medium mb-1">Descriere <span className="text-red-500">*</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2" rows="3" required />
        </div>

        {/* Data */}
        <div>
          <label className="block font-medium mb-1">Data și ora <span className="text-red-500">*</span></label>
          <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>

        {/* Bilete */}
        <div>
          <label className="block font-medium mb-1">Număr total bilete <span className="text-red-500">*</span></label>
          <input type="number" name="totalTickets" value={formData.totalTickets} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>

        {/* Oraș */}
        <div>
          <label className="block font-medium mb-1">Oraș <span className="text-red-500">*</span></label>
          <select name="city" value={formData.city} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Alege orașul</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Locație */}
        <div>
          <label className="block font-medium mb-1">Locația <span className="text-red-500">*</span></label>
          <select name="location" value={formData.location} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Alege locația</option>
            {availableLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Categorie */}
        <div>
          <label className="block font-medium mb-1">Categoria <span className="text-red-500">*</span></label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Alege categoria</option>
            {eventCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Preț */}
        <div>
          <label className="block font-medium mb-1">Preț bilet (RON) <span className="text-red-500">*</span></label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>

        {/* Imagine */}
        <div className="flex items-center gap-3">
          <label className="relative inline-block">
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="sr-only" required />
            <span className="inline-block px-4 py-2 bg-gray-200 text-sm font-medium rounded cursor-pointer hover:bg-gray-300">Alege imaginea</span>
          </label>
          <span className="text-sm text-gray-500">{imageName || 'Nu ai imagine atașată'}</span>
        </div>

        {/* Submit */}
        <button type="submit" className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
          Creează Eveniment
        </button>
      </form>

      {loading && <LoadingOverlay text="Se creează evenimentul..." />}
    </div>
  );
};

export default CreateEvent;
