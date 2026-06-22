

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

interface FocusChartProps {
  history: {
    time: string;
    score: number;
  }[];
}

const FocusChart = ({ history }: FocusChartProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-purple-700">
            📈 Live Attention Analytics
          </h2>

          <p className="text-gray-600 mt-2 font-medium">
            Real-time focus & behavioral tracking
          </p>
        </div>

        <div className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-5 py-3 rounded-2xl font-bold shadow-lg animate-pulse">
          AI ACTIVE
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={history}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#d8b4fe" />

            <XAxis
              dataKey="time"
              tick={{ fill: '#7e22ce', fontSize: 12 }}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#7e22ce', fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '2px solid #c084fc',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              fillOpacity={1}
              fill="url(#focusGradient)"
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={4}
              dot={{ r: 5, fill: '#06b6d4' }}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyan-100 rounded-2xl p-5 text-center shadow-md">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-bold text-purple-700 text-lg">
            Focus Tracking
          </div>
        </div>

        <div className="bg-pink-100 rounded-2xl p-5 text-center shadow-md">
          <div className="text-3xl mb-2">🧠</div>
          <div className="font-bold text-purple-700 text-lg">
            Behavioral AI
          </div>
        </div>

        <div className="bg-yellow-100 rounded-2xl p-5 text-center shadow-md">
          <div className="text-3xl mb-2">📊</div>
          <div className="font-bold text-purple-700 text-lg">
            Live Analytics
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusChart;