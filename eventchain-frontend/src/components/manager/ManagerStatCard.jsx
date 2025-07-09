const ManagerStatCard = ({ label, value }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition-shadow duration-200">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default ManagerStatCard;
