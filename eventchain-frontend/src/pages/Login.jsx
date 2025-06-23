import googleIcon from '../assets/google-icon.png';
import partyIllustration from '../assets/undraw_having-fun_kkeu.svg';

const Login = () => {
  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = 'http://localhost:3000/api/users/google/callback';

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;

    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md flex flex-col items-center text-center">
        <img src={partyIllustration} alt="Party" className="w-40 sm:w-48 mb-6" />

        <h1 className="text-base sm:text-lg font-medium text-gray-800 mb-4">
          Autentificare necesară pentru a accesa platforma
        </h1>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow hover:bg-blue-700 transition border-2 border-orange-300 mb-6 text-sm sm:text-base"
        >
          <img src={googleIcon} alt="Google Icon" className="w-5 h-5" />
          <span className="whitespace-nowrap">
            Autentifică-te cu Google
            <span className="hidden sm:inline"> pentru a continua</span>
          </span>
        </button>

        <div className="flex flex-col gap-2 text-xs text-gray-500 w-full px-2">
          <div className="flex items-start gap-2">
            <span className="text-orange-500">🔒</span>
            <p className="text-left">Adresa ta de email rămâne confidențială.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500">🔓</span>
            <p className="text-left">Poți vedea biletele cumpărate și accesa evenimentele.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
