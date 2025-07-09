import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Concerte', value: 235 },
  { name: 'Stand-up', value: 55 },
  { name: 'Teatru', value: 65 },
  { name: 'Conferințe', value: 200 }
];

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7'];

const CategoryChart = () => {
  return (
    <div className="bg-white p-4 pt-6 rounded-2xl shadow w-full h-full">
      <h3 className="font-bold mb-4">Distribuție pe categorii</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart margin={{ top: 20 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <ul className="mt-4 text-sm text-gray-700 space-y-1">
        {data.map((item, index) => (
          <li key={index}>
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></span>
            {item.name} – {item.value} bilete
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryChart;
