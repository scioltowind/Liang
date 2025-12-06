import React, { useState, useMemo } from 'react';
import { Expert, FilterState } from '../types';
import { Search, Download, Trash2, SlidersHorizontal, Phone } from 'lucide-react';

interface ExpertListProps {
  experts: Expert[];
  onDelete: (id: string) => void;
}

const ExpertList: React.FC<ExpertListProps> = ({ experts, onDelete }) => {
  const [filters, setFilters] = useState<FilterState>({
    profession: '',
    organization: '',
    field: '',
    expertise: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      return (
        expert.profession.toLowerCase().includes(filters.profession.toLowerCase()) &&
        expert.organization.toLowerCase().includes(filters.organization.toLowerCase()) &&
        expert.field.toLowerCase().includes(filters.field.toLowerCase()) &&
        expert.expertise.toLowerCase().includes(filters.expertise.toLowerCase())
      );
    });
  }, [experts, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleExport = () => {
    if (filteredExperts.length === 0) return;

    const headers = ['姓名', '職業', '服務單位', '領域', '專長', '電話', '合作計畫'];
    const csvRows = [
      headers.join(','),
      ...filteredExperts.map((expert) => {
        return [
          `"${expert.name}"`,
          `"${expert.profession}"`,
          `"${expert.organization}"`,
          `"${expert.field}"`,
          `"${expert.expertise}"`,
          `"${expert.phone || ''}"`,
          `"${expert.projects.replace(/"/g, '""')}"`, // Escape quotes
        ].join(',');
      }),
    ];

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join('\n'); // Add BOM for Excel Chinese support
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', '專家資料匯出.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Controls Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
             <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
             >
                <SlidersHorizontal className="w-4 h-4" />
                篩選
             </button>
             <span className="text-sm text-gray-500">
                顯示 {filteredExperts.length} 筆，共 {experts.length} 筆
             </span>
        </div>

        <button
          onClick={handleExport}
          disabled={filteredExperts.length === 0}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          匯出 CSV
        </button>
      </div>

      {/* Filter Inputs Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="profession"
              placeholder="篩選職業..."
              value={filters.profession}
              onChange={handleFilterChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="organization"
              placeholder="篩選服務單位..."
              value={filters.organization}
              onChange={handleFilterChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="field"
              placeholder="篩選領域..."
              value={filters.field}
              onChange={handleFilterChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="expertise"
              placeholder="篩選專長..."
              value={filters.expertise}
              onChange={handleFilterChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Table View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">姓名</th>
                <th className="px-6 py-4 font-semibold text-gray-700">職業</th>
                <th className="px-6 py-4 font-semibold text-gray-700">服務單位</th>
                <th className="px-6 py-4 font-semibold text-gray-700">領域</th>
                <th className="px-6 py-4 font-semibold text-gray-700">專長</th>
                <th className="px-6 py-4 font-semibold text-gray-700">電話</th>
                <th className="px-6 py-4 font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExperts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    未找到符合條件的專家。
                  </td>
                </tr>
              ) : (
                filteredExperts.map((expert) => (
                  <tr key={expert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{expert.name}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{expert.profession}</td>
                    <td className="px-6 py-4 text-gray-600">{expert.organization}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {expert.field}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={expert.expertise}>
                      {expert.expertise}
                    </td>
                     <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {expert.phone ? (
                             <div className="flex items-center gap-1 text-xs">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {expert.phone}
                             </div>
                        ) : (
                            <span className="text-gray-300">-</span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onDelete(expert.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="刪除專家"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpertList;