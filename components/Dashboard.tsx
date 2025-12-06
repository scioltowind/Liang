import React, { useMemo } from 'react';
import { Expert } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardProps {
  experts: Expert[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const Dashboard: React.FC<DashboardProps> = ({ experts }) => {
  const professionData = useMemo(() => {
    const counts: Record<string, number> = {};
    experts.forEach((e) => {
      counts[e.profession] = (counts[e.profession] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));
  }, [experts]);

  const fieldData = useMemo(() => {
    const counts: Record<string, number> = {};
    experts.forEach((e) => {
      counts[e.field] = (counts[e.field] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));
  }, [experts]);

  if (experts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg">儀表板暫無數據</p>
        <p className="text-sm">請新增專家或產生範例資料以查看統計資訊。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profession Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">依職業別統計</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#4F46E5" radius={[0, 4, 4, 0]} name="人數" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Field Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">依領域別統計</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fieldData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {fieldData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">快速統計</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">專家總數</p>
                <p className="text-2xl font-bold text-blue-900">{experts.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">領域數量</p>
                <p className="text-2xl font-bold text-green-900">{fieldData.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">職業數量</p>
                <p className="text-2xl font-bold text-purple-900">{professionData.length}</p>
            </div>
             <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600 font-medium">有合作計畫比例</p>
                <p className="text-2xl font-bold text-orange-900">
                    {experts.length > 0 
                     ? (experts.reduce((acc, curr) => acc + (curr.projects ? 1 : 0), 0) / experts.length * 100).toFixed(0) + '%' 
                     : '0%'}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;