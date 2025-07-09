const LoadingOverlay = ({ text = "Se încarcă..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Fundal blurat și semi-transparent alb */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />

      {/* Conținutul */}
      <div className="bg-white px-6 py-4 rounded-lg shadow text-center z-10">
        <div className="loader mb-3 mx-auto"></div>
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
