import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🔐 Pagini user (protejate)
import Home from './pages/user/Home';
import SearchPage from './pages/user/SearchPage';
import Login from './pages/user/Login';
import EventDetails from './pages/user/EventDetails';
import MyTickets from './pages/user/MyTickets';
import Logout from './pages/user/Logout';

// 🔓 Pagini comune/publice
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

// 🔐 Protecție user
import ProtectedRoute from './components/user/ProtectedRoute';

// 🔐 Protecție manager
import ProtectedRouteManager from './components/manager/ProtectedRouteManager';

// 👨‍💼 Pagini manager
import ManagerDashboard from './pages/manager/ManagerDashboard';
import CreateEvent from './pages/manager/CreateEvent';
import EditEvent from './pages/manager/EditEvent';
import ManagerLogin from './pages/manager/ManagerLogin';
import LogoutManager from './components/manager/LogoutManager';

function App() {
  return (
    <Router>
      {/* 🔔 Notificări */}
      <ToastContainer position="top-center" autoClose={3000} />

      <Routes>
        {/* 🔐 Pagini protejate (user) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />

        {/* 🔓 Pagini publice */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* 👨‍💼 Pagini manager protejate */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRouteManager>
              <ManagerDashboard />
            </ProtectedRouteManager>
          }
        />
        <Route
          path="/manager/create-event"
          element={
            <ProtectedRouteManager>
              <CreateEvent />
            </ProtectedRouteManager>
          }
        />
        <Route
          path="/manager/events/:eventId/edit"
          element={
            <ProtectedRouteManager>
              <EditEvent />
            </ProtectedRouteManager>
          }
        />

        {/* 👨‍💼 Pagini manager neprotejate */}
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/logout" element={<LogoutManager />} />

        {/* 🛑 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
