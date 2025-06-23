import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import MyTickets from './pages/MyTickets';
import AuthCallback from './pages/AuthCallback';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound'; // ✅ pagina 404
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔐 Pagini protejate (doar pentru useri) */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/my-tickets" element={
          <ProtectedRoute>
            <MyTickets />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/event/:id" element={
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        } />

        {/* 🔓 Pagini publice */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/logout" element={<Logout />} />

        {/* 🛑 Pagina fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
