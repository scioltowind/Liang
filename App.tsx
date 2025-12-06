import React, { useState, useEffect } from 'react';
import { Expert } from './types';
import ExpertForm from './components/ExpertForm';
import ExpertList from './components/ExpertList';
import Dashboard from './components/Dashboard';
import DataMaintenance from './components/DataMaintenance';
import { generateSampleExperts, analyzeExpertsWithGemini } from './services/geminiService';
import { 
    LayoutDashboard, 
    List, 
    UserPlus, 
    Sparkles, 
    Bot,
    MessageSquare,
    Send,
    Loader2,
    Settings
} from 'lucide-react';

// --- Helper Types for Tab Navigation ---
type Tab = 'dashboard' | 'list' | 'add' | 'analysis' | 'maintenance';

// Initial data in Chinese
const DEFAULT_PROFESSIONS = ['教授', '副教授', '助理教授', '研究員', '工程師', '主任', '經理', '顧問', '醫師'];
const DEFAULT_FIELDS = ['人工智慧', '生物科技', '半導體', '綠色能源', '金融科技', '醫療', '教育', '智慧城市'];

const App: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [professions, setProfessions] = useState<string[]>(DEFAULT_PROFESSIONS);
  const [fields, setFields] = useState<string[]>(DEFAULT_FIELDS);
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [isLoading, setIsLoading] = useState(false);

  // Analysis State
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    const savedExperts = localStorage.getItem('experts_db');
    if (savedExperts) {
      try {
        setExperts(JSON.parse(savedExperts));
      } catch (e) {
        console.error("Failed to parse saved experts");
      }
    }

    const savedProfessions = localStorage.getItem('experts_professions');
    if (savedProfessions) {
        try {
            setProfessions(JSON.parse(savedProfessions));
        } catch(e) {}
    }

    const savedFields = localStorage.getItem('experts_fields');
    if (savedFields) {
        try {
            setFields(JSON.parse(savedFields));
        } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('experts_db', JSON.stringify(experts));
  }, [experts]);

  useEffect(() => {
      localStorage.setItem('experts_professions', JSON.stringify(professions));
  }, [professions]);

  useEffect(() => {
      localStorage.setItem('experts_fields', JSON.stringify(fields));
  }, [fields]);

  // --- Handlers ---
  const handleAddExpert = (expert: Expert) => {
    setExperts((prev) => [expert, ...prev]);
    alert("專家新增成功！");
    setActiveTab('list');
  };

  const handleDeleteExpert = (id: string) => {
    if (window.confirm("確定要刪除這位專家資料嗎？")) {
      setExperts((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleGenerateData = async () => {
    setIsLoading(true);
    try {
      const samples = await generateSampleExperts(10);
      setExperts((prev) => [...samples, ...prev]);
      alert("成功新增 10 筆 AI 產生的範例專家資料！");
    } catch (error) {
      alert("產生資料失敗，請檢查 API Key。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisQuery.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResult('');
    
    try {
        const result = await analyzeExpertsWithGemini(experts, analysisQuery);
        setAnalysisResult(result);
    } catch (err) {
        setAnalysisResult("資料分析錯誤。");
    } finally {
        setIsAnalyzing(false);
    }
  };

  // Maintenance Handlers
  const addProfession = (val: string) => {
      if(!professions.includes(val)) setProfessions([...professions, val]);
  }
  const removeProfession = (val: string) => {
      if(confirm(`確定移除職業「${val}」？`)) setProfessions(professions.filter(p => p !== val));
  }
  const addField = (val: string) => {
      if(!fields.includes(val)) setFields([...fields, val]);
  }
  const removeField = (val: string) => {
      if(confirm(`確定移除領域「${val}」？`)) setFields(fields.filter(f => f !== val));
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                專家管理系統
              </span>
            </div>
            
            {/* Desktop Tabs */}
            <div className="hidden md:flex space-x-1 items-center">
               <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                儀表板
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
                專家列表
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'add' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <UserPlus className="w-4 h-4" />
                新增專家
              </button>
               <button
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Bot className="w-4 h-4" />
                AI 分析
              </button>
               <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'maintenance' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Settings className="w-4 h-4" />
                資料維護
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome / Empty State Action */}
        {experts.length === 0 && activeTab !== 'add' && activeTab !== 'maintenance' && (
           <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-8 mb-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
                <h2 className="text-2xl font-bold mb-2">歡迎使用專家管理系統</h2>
                <p className="text-indigo-100 opacity-90 max-w-xl">
                  您的智慧化專業人脈管理資料庫。
                  目前列表為空。您可以使用 Gemini AI 強大的生成功能，立即建立範例資料。
                </p>
             </div>
             <button 
                onClick={handleGenerateData}
                disabled={isLoading}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-70"
             >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                產生範例資料
             </button>
           </div>
        )}

        {/* Tab Content */}
        <div className="transition-all duration-300">
            {activeTab === 'dashboard' && <Dashboard experts={experts} />}
            
            {activeTab === 'list' && (
                <ExpertList experts={experts} onDelete={handleDeleteExpert} />
            )}
            
            {activeTab === 'add' && (
                <ExpertForm 
                    onAddExpert={handleAddExpert} 
                    availableProfessions={professions}
                    availableFields={fields}
                />
            )}

            {activeTab === 'maintenance' && (
                <DataMaintenance 
                    professions={professions}
                    fields={fields}
                    onAddProfession={addProfession}
                    onRemoveProfession={removeProfession}
                    onAddField={addField}
                    onRemoveField={removeField}
                />
            )}

            {activeTab === 'analysis' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Bot className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">詢問 Gemini 關於您的資料</h2>
                                <p className="text-sm text-gray-500">分析趨勢、尋找關聯或總結專家專長。</p>
                            </div>
                        </div>

                        <form onSubmit={handleAnalysis} className="relative">
                            <input 
                                type="text"
                                value={analysisQuery}
                                onChange={(e) => setAnalysisQuery(e.target.value)}
                                placeholder="例如：「哪個單位的 AI 專家最多？」或「建議一個綠能計畫的團隊名單」"
                                className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            />
                            <button 
                                type="submit"
                                disabled={isAnalyzing || experts.length === 0}
                                className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" />}
                            </button>
                        </form>
                    </div>

                    {analysisResult && (
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100 animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
                            <div className="flex items-start gap-3">
                                <MessageSquare className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                                <div className="prose prose-indigo max-w-none text-gray-700">
                                    {/* Simple markdown rendering by splitting newlines */}
                                    {analysisResult.split('\n').map((line, i) => (
                                        <p key={i} className={line.startsWith('#') ? 'font-bold text-gray-900 text-lg mt-4' : 'mb-2'}>
                                            {line.replace(/^#+\s/, '')}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 z-40 pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] mt-1">儀表板</span>
        </button>
        <button onClick={() => setActiveTab('list')} className={`flex flex-col items-center ${activeTab === 'list' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <List className="w-6 h-6" />
            <span className="text-[10px] mt-1">列表</span>
        </button>
        <button onClick={() => setActiveTab('add')} className={`flex flex-col items-center ${activeTab === 'add' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <UserPlus className="w-6 h-6" />
            <span className="text-[10px] mt-1">新增</span>
        </button>
         <button onClick={() => setActiveTab('maintenance')} className={`flex flex-col items-center ${activeTab === 'maintenance' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Settings className="w-6 h-6" />
            <span className="text-[10px] mt-1">維護</span>
        </button>
        <button onClick={() => setActiveTab('analysis')} className={`flex flex-col items-center ${activeTab === 'analysis' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Bot className="w-6 h-6" />
            <span className="text-[10px] mt-1">分析</span>
        </button>
      </div>
    </div>
  );
};

export default App;