import { GoogleGenAI, Type } from "@google/genai";
import { Expert } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const generateSampleExperts = async (count: number = 5): Promise<Expert[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `請產生 ${count} 筆虛擬的台灣專家資料，用於專業資料庫。
      需要的欄位：
      - name (姓名，繁體中文)
      - profession (職業，如：教授、工程師、經理、研究員)
      - organization (服務單位，如：台灣大學、台積電、工研院)
      - field (領域別，如：人工智慧、生技醫療、綠色能源、半導體)
      - expertise (專長，逗號分隔，繁體中文)
      - projects (合作計畫簡述，繁體中文)
      - phone (虛擬的台灣手機號碼，格式：09xx-xxx-xxx)
      
      請確保「職業」和「領域」符合一般常見分類。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              profession: { type: Type.STRING },
              organization: { type: Type.STRING },
              field: { type: Type.STRING },
              expertise: { type: Type.STRING },
              projects: { type: Type.STRING },
              phone: { type: Type.STRING },
            },
            required: ["name", "profession", "organization", "field", "expertise", "projects"],
          },
        },
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    return data.map((item: any) => ({
      ...item,
      id: crypto.randomUUID(),
    }));
  } catch (error) {
    console.error("Error generating experts:", error);
    throw error;
  }
};

export const analyzeExpertsWithGemini = async (experts: Expert[], query: string): Promise<string> => {
  try {
    const context = JSON.stringify(experts);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `你是一位專業的資料分析助手。這是目前的專家資料庫（JSON 格式）：${context}。
      
      使用者查詢："${query}"
      
      請分析資料以回答查詢。提供見解、潛在的跨領域合作機會，或基於數據的具體統計。請使用繁體中文回答，並保持簡潔，使用 Markdown 格式。`,
    });

    return response.text || "無法產生分析結果。";
  } catch (error) {
    console.error("Error analyzing experts:", error);
    return "分析資料失敗，請檢查您的 API Key 或稍後再試。";
  }
};