export interface Expert {
  id: string;
  name: string;
  profession: string; // 職業
  organization: string; // 服務單位
  field: string; // 領域別
  expertise: string; // 專長
  projects: string; // 合作計畫
  phone?: string; // 聯絡電話 (Optional)
}

export type FilterState = {
  profession: string;
  organization: string;
  field: string;
  expertise: string;
};