const DeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center px-4">
      {/* Fundal blurat și transparent */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />

      {/* Conținut modal */}
      <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl z-10 relative">
        {/* Buton ✕ */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-4 text-gray-500 text-xl"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-4">Confirmare ștergere</h2>
        <p className="text-sm text-gray-600 mb-6">
          Atenție! Dacă confirmi această operațiune, toate detaliile evenimentului se vor șterge și nu vor putea fi recuperate.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300"
          >
            Anulează
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            Șterge evenimentul
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
