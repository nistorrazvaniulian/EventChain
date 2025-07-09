import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { date: '24 Iun', sold: 10 },
  { date: '25 Iun', sold: 65 },
  { date: '26 Iun', sold: 40 },
  { date: '27 Iun', sold: 90 },
  { date: '28 Iun', sold: 30 },
];

const total = data.reduce((acc, d) => acc + d.sold, 0);

const SalesChart = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow h-[300px] flex flex-col justify-between">
      <h3 className="font-bold mb-2">Vânzări pe zile</h3>

      <div className="flex-1 flex items-center justify-center overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sold"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-700 mt-2 text-left">
        Total bilete vândute: <span className="font-semibold">{total}</span>
      </p>
    </div>
  );
};

export default SalesChart;
