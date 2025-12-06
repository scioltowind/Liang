import React, { useState } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';

interface DataMaintenanceProps {
  professions: string[];
  fields: string[];
  onAddProfession: (val: string) => void;
  onRemoveProfession: (val: string) => void;
  onAddField: (val: string) => void;
  onRemoveField: (val: string) => void;
}

const DataMaintenance: React.FC<DataMaintenanceProps> = ({
  professions,
  fields,
  onAddProfession,
  onRemoveProfession,
  onAddField,
  onRemoveField,
}) => {
  const [newProfession, setNewProfession] = useState('');
  const [newField, setNewField] = useState('');

  const handleAddProf = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfession.trim()) {
      onAddProfession(newProfession.trim());
      setNewProfession('');
    }
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (newField.trim()) {
      onAddField(newField.trim());
      setNewField('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
                <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">資料維護</h2>
                <p className="text-sm text-gray-500">管理「職業別」與「領域別」的下拉選單選項。</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Professions Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">職業別維護</h3>
          
          <ul className="flex-1 overflow-y-auto max-h-96 space-y-2 mb-4 pr-2">
            {professions.map((prof) => (
              <li key={prof} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg group hover:bg-indigo-50 transition-colors">
                <span className="font-medium text-gray-700">{prof}</span>
                <button
                  onClick={() => onRemoveProfession(prof)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="移除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {professions.length === 0 && <li className="text-gray-400 text-center italic py-4">尚未定義職業。</li>}
          </ul>

          <form onSubmit={handleAddProf} className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={newProfession}
              onChange={(e) => setNewProfession(e.target.value)}
              placeholder="新增職業..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!newProfession.trim()}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Fields Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">領域別維護</h3>
          
          <ul className="flex-1 overflow-y-auto max-h-96 space-y-2 mb-4 pr-2">
            {fields.map((field) => (
              <li key={field} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg group hover:bg-green-50 transition-colors">
                <span className="font-medium text-gray-700">{field}</span>
                <button
                  onClick={() => onRemoveField(field)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="移除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
             {fields.length === 0 && <li className="text-gray-400 text-center italic py-4">尚未定義領域。</li>}
          </ul>

          <form onSubmit={handleAddField} className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              placeholder="新增領域..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!newField.trim()}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataMaintenance;