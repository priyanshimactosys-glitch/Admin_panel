import { API_ENDPOINTS } from "../../lib/api/api-endpoints";
import { Axios } from "../../lib/api/axios";

/* ================= DASHBOARD ================= */

export interface DashboardStats {
  total_calls_today: number;
  active_campaigns: number;
  total_contacts: number;
  success_rate: number;
}

export interface RecentCampaign {
  [key: string]: any;
}

export interface TopPerformance {
  [key: string]: any;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_campaigns: RecentCampaign[];
  top_performance: TopPerformance[];
}

export interface DashboardResponse {
  status?: string;
  success?: boolean;
  message?: string;
  data: DashboardData;
  [key: string]: any;
}

export const getDashboard = async (): Promise<DashboardResponse> => {
  const response = await Axios.get(API_ENDPOINTS.DASHBOARD.GET_DASHBOARD);
  return response.data;
};