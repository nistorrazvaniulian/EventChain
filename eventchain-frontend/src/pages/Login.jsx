import googleIcon from '../assets/google-icon.ico';
import partyIllustration from '../assets/undraw_having-fun_kkeu.svg';

const Login = () => {
  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md flex flex-col items-center text-center">
        <img
          src={partyIllustration}
          alt="Party Illustration"
          className="w-40 sm:w-48 mb-6"
        />
        <h1 className="text-lg font-medium text-gray-800 mb-4">
          Autentificare necesară pentru a accesa platforma
        </h1>

        <button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow hover:bg-blue-700 transition border-2 border-orange-300 mb-6">
          <img src={googleIcon} alt="Google Icon" className="w-5 h-5" />
          Autentifică-te cu Google pentru a continua
        </button>

        <div className="flex flex-col gap-2 text-xs text-gray-500 px-2">
          <div className="flex items-start justify-center gap-2">
            <span className="text-orange-500">🔒</span>
            <p>Nu vom posta în numele tău. Adresa ta de email rămâne confidențială.</p>
          </div>
          <div className="flex items-start justify-center gap-2">
            <span className="text-orange-500">🔓</span>
            <p>Cu contul tău poți vedea biletele cumpărate, rezerva locuri și accesa evenimente.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
