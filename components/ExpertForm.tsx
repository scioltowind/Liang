import React, { useState } from 'react';
import { Expert } from '../types';
import { Plus, Save, Sparkles, Loader2 } from 'lucide-react';
import { generateSampleExperts } from '../services/geminiService';

interface ExpertFormProps {
  onAddExpert: (expert: Expert) => void;
  availableProfessions: string[];
  availableFields: string[];
}

const ExpertForm: React.FC<ExpertFormProps> = ({ onAddExpert, availableProfessions, availableFields }) => {
  const [formData, setFormData] = useState<Omit<Expert, 'id'>>({
    name: '',
    profession: availableProfessions[0] || '',
    organization: '',
    field: availableFields[0] || '',
    expertise: '',
    projects: '',
    phone: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpert({
      ...formData,
      id: crypto.randomUUID(),
    });
    setFormData({
      name: '',
      profession: availableProfessions[0] || '',
      organization: '',
      field: availableFields[0] || '',
      expertise: '',
      projects: '',
      phone: '',
    });
  };

  const handleGenerateSample = async () => {
    if(!window.confirm("這將使用 Gemini AI 產生一筆隨機專家資料。確定繼續？")) return;
    
    setIsGenerating(true);
    try {
        const samples = await generateSampleExperts(1);
        if(samples && samples.length > 0) {
            const sample = samples[0];
            const { id, ...rest } = sample;
            setFormData(prev => ({ ...prev, ...rest }));
        }
    } catch (e) {
        alert("產生範例資料失敗，請確認 API Key 設定。");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            新增專家
        </h2>
        <button
            type="button"
            onClick={handleGenerateSample}
            disabled={isGenerating}
            className="text-sm flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
        >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4" />}
            AI 自動填寫
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">專家姓名</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="例如：林博士"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">職業</label>
            <select
              required
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
                <option value="" disabled>請選擇職業</option>
                {availableProfessions.map(p => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服務單位</label>
            <input
              required
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="例如：台灣大學醫院"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">領域別</label>
             <select
              required
              name="field"
              value={formData.field}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
            >
                <option value="" disabled>請選擇領域</option>
                {availableFields.map(f => (
                    <option key={f} value={f}>{f}</option>
                ))}
            </select>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">聯絡電話 <span className="text-gray-400 font-normal text-xs">(選填)</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="例如：0912-345-678"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">專長</label>
          <input
            required
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="例如：機器學習、資料探勘（請以逗號分隔）"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">合作計畫</label>
          <textarea
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="請簡述過去或目前的合作計畫..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Save className="w-4 h-4" />
            儲存專家
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpertForm;