import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from '../../components/LoadingOverlay';
import eventCategories from '../../constants/eventCategories';
import cities from '../../constants/cities';
import locations from '../../constants/locations';

const API_URL = import.meta.env.VITE_API_URL;

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    totalTickets: '',
    location: '',
    city: '',
    category: '',
    price: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [eventImageName, setEventImageName] = useState('Nu ai imagine atașată');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('managerToken')}`
          }
        });

        if (!res.ok) throw new Error('Eroare la preluarea evenimentului');

        const data = await res.json();

        setFormData({
          title: data.title,
          description: data.description,
          date: new Date(data.date).toISOString().slice(0, 16),
          totalTickets: data.totalTickets,
          location: data.location,
          city: data.city,
          category: data.category,
          price: data.price
        });

        setEventImageName(data.image || 'Nu ai imagine atașată');
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setFormData((prev) => ({ ...prev, city: value, location: '' })); // reset location dacă orașul se schimbă
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setEventImageName(file?.name || 'Nu ai imagine atașată');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    if (imageFile) {
      form.append('image', imageFile);
    }

    try {
      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('managerToken')}`
        },
        body: form
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Eroare la actualizarea evenimentului');
      }

      toast.success('Evenimentul a fost actualizat cu succes!');
      setTimeout(() => navigate('/manager/dashboard'), 2000);
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  const availableLocations = locations[formData.city] || [];

  if (loading) return <div className="text-center mt-10">Se încarcă...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
        <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Editează Evenimentul</h2>
          <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${submitting ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div>
              <label className="block font-medium">Titlul evenimentului *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Descriere *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded resize-none"
                rows="4"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium">Data și ora *</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Număr total bilete *</label>
              <input
                type="number"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium">Oraș *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Alege orașul</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block font-medium">Locația *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Alege locația</option>
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium">Categoria *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Alege categoria</option>
                {eventCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Preț bilet (RON) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Imaginea evenimentului</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                <span className="text-sm text-gray-600">{eventImageName}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow hover:bg-blue-700 transition border-2 border-orange-300 text-sm sm:text-base"
            >
              Salvează modificările
            </button>
          </form>
        </div>

        {submitting && <LoadingOverlay text="Se salvează modificările..." />}
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar theme="colored" />
    </>
  );
};

export default EditEvent;
