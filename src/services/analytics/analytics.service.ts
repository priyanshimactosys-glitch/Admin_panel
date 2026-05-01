import { API_ENDPOINTS } from "../../lib/api/api-endpoints";
import { Axios } from "../../lib/api/axios";

/** 
 * --- SHARED TYPES --- 
 */
export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export interface AnalyticsParams {
  days?: number | string;
}

/** 
 * --- DATA MODELS --- 
 */
export interface AnalyticsSummaryData {
  period_days: number;
  total_calls: number;
  answered_calls: number;
  no_answer: number;
  busy: number;
  failed: number;
  success_rate: number;
  avg_call_duration: number;
}

export interface CallTrendItem {
  _id: string; // Date string
  total_calls: number;
  answered: number;
}

export interface LanguageDistributionItem {
  _id: string; // Language name
  total_calls: number;
  answered: number;
  campaigns: number;
}

export interface ProvincePerformanceItem {
  _id: string; // Province name
  total_calls: number;
  answered: number;
}

export interface CallOutcomeItem {
  outcome: "Answered" | "No Answer" | "Busy" | "Failed";
  count: number;
  percentage: number;
}

/** 
 * --- ANALYTICS SERVICES --- 
 */

// 1. Summary Stats
export const getAnalyticsSummary = async (params?: AnalyticsParams): Promise<ApiResponse<AnalyticsSummaryData>> => {
  const { data } = await Axios.get(API_ENDPOINTS.ANALYTICS.SUMMARY, { params });
  return data;
};

// 2. Call Volume Trend
export const getCallVolumeTrend = async (params?: AnalyticsParams): Promise<ApiResponse<CallTrendItem[]>> => {
  const { data } = await Axios.get(API_ENDPOINTS.ANALYTICS.CALL_VOLUME, { params });
  return data;
};

// 3. Peak Call Times (Today)
export const getPeakCallTimes = async (): Promise<ApiResponse<any>> => {
  const { data } = await Axios.get(API_ENDPOINTS.ANALYTICS.PEAK_TIMES);
  return data;
};

// 4. Language Distribution
export const getLanguageDistribution = async (params?: AnalyticsParams): Promise<ApiResponse<LanguageDistributionItem[]>> => {
  const { data } = await Axios.get(API_ENDPOINTS.ANALYTICS.LANGUAGE_DIST, { params });
  return data;
};

// 5. Province Performance
export const getProvincePerformance = async (params?: AnalyticsParams): Promise<ApiResponse<ProvincePerformanceItem[]>> => {
  const { data } = await Axios.get(API_ENDPOINTS.ANALYTICS.PROVINCE_PERFORMANCE, { params });
  return data;
};

// 6. Call Outcomes Breakdown
export const getCallOutcomesBreakdown = async (params?: AnalyticsParams): Promise<ApiResponse<CallOutcomeItem[]>> => {
  const { data } = await Axios.get(API_ENDPOINTS.ANALYTICS.CALL_OUTCOMES, { params });
  return data;
};

// 7. Record Analytics Snapshot (Cron Task)
export const recordAnalyticsSnapshot = async (): Promise<{ status: string; message: string }> => {
  const { data } = await Axios.post(API_ENDPOINTS.ANALYTICS.RECORD_SNAPSHOT);
  return data;
};