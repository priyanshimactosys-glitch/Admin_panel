import { API_ENDPOINTS } from "../../lib/api/api-endpoints";
import { Axios } from "../../lib/api/axios";

/* ================= CAMPAIGN TYPES ================= */

export interface CampaignCreatedBy {
  _id: string;
  first_name: string;
  email: string;
  id: string;
}

export interface CampaignItem {
  _id: string;
  id: string;
  campaign_name: string;
  campaign_type: string;
  description?: string;
  message_type?: string;
  voice_message_id?: string | null;
  voice_message_name?: string | null;
  languages: string[];
  contact_list_id?: string | null;
  contact_list_name?: string | null;
  filter_province?: string;
  filter_age_group?: string;
  estimated_recipients?: number;
  schedule_type?: string;
  start_date?: string | null;
  end_date?: string | null;
  retry_attempts?: number;
  call_timeout?: number;
  caller_id?: string;
  record_calls?: boolean;
  allow_opt_out?: boolean;
  sms_followup?: boolean;
  status: string;
  progress?: number;
  total_calls?: number;
  answered_calls?: number;
  no_answer?: number;
  busy?: number;
  failed?: number;
  success_rate?: number;
  estimated_cost?: number;
  cost_per_call?: number;
  estimated_duration_hours?: number;
  created_by?: CampaignCreatedBy;
  launched_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  __v?: number;
}

/* ================= PARAMS ================= */

export interface GetCampaignsParams {
  page?: number;
  limit?: number;
  status?: string;
  campaign_type?: string;
  search?: string;
}

/* ================= PAYLOADS ================= */

export interface CreateCampaignPayload {
  campaign_name: string;
  campaign_type: string;
  description?: string;
  message_type?: string;
  voice_message_id?: string | null;
  languages?: string[];
  contact_list_id?: string | null;
  filter_province?: string;
  filter_age_group?: string;
  schedule_type?: string;
  start_date?: string | null;
  end_date?: string | null;
  retry_attempts?: number;
  call_timeout?: number;
  caller_id?: string;
  record_calls?: boolean;
  allow_opt_out?: boolean;
  sms_followup?: boolean;
  cost_per_call?: number;
}

export interface SaveDraftCampaignPayload {
  campaign_name: string;
  campaign_type: string;
  description?: string;
  languages?: string[];
  schedule_type?: string;
  start_date?: string | null;
  end_date?: string | null;
}

export interface UpdateCampaignPayload extends Partial<CreateCampaignPayload> {
  status?: string;
}

/* ================= RESPONSES ================= */

export interface GetCampaignsResponse {
  status: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: CampaignItem[];
}

export interface CampaignSingleResponse {
  status: string;
  message?: string;
  data: CampaignItem;
}

export interface CampaignStats {
  total_campaigns?: number;
  active_campaigns?: number;
  completed_campaigns?: number;
  draft_campaigns?: number;
  paused_campaigns?: number;
  total_calls?: number;
  success_rate?: number;
  [key: string]: any;
}

export interface CampaignStatsResponse {
  status: string;
  data: CampaignStats;
}

export interface CampaignListSimpleResponse {
  status: string;
  data: CampaignItem[];
}

/* ================= API FUNCTIONS ================= */

export const getCampaignStats = async (): Promise<CampaignStatsResponse> => {
  const response = await Axios.get(API_ENDPOINTS.CAMPAIGNS.STATS);
  return response.data;
};

export const getRecentCampaigns =
  async (): Promise<CampaignListSimpleResponse> => {
    const response = await Axios.get(API_ENDPOINTS.CAMPAIGNS.RECENT);
    return response.data;
  };

export const getTopPerformance =
  async (): Promise<CampaignListSimpleResponse> => {
    const response = await Axios.get(API_ENDPOINTS.CAMPAIGNS.TOP_PERFORMANCE);
    return response.data;
  };

export const getCampaigns = async (
  params?: GetCampaignsParams
): Promise<GetCampaignsResponse> => {
  const response = await Axios.get(API_ENDPOINTS.CAMPAIGNS.LIST, { params });
  return response.data;
};

export const getCampaignById = async (
  id: string
): Promise<CampaignSingleResponse> => {
  const response = await Axios.get(API_ENDPOINTS.CAMPAIGNS.DETAIL(id));
  return response.data;
};

export const createCampaign = async (
  payload: CreateCampaignPayload
): Promise<CampaignSingleResponse> => {
  const response = await Axios.post(API_ENDPOINTS.CAMPAIGNS.CREATE, payload);
  return response.data;
};

export const saveCampaignAsDraft = async (
  payload: SaveDraftCampaignPayload
): Promise<CampaignSingleResponse> => {
  const response = await Axios.post(API_ENDPOINTS.CAMPAIGNS.SAVE_DRAFT, payload);
  return response.data;
};

export const updateCampaign = async (
  id: string,
  payload: UpdateCampaignPayload
): Promise<CampaignSingleResponse> => {
  const response = await Axios.put(API_ENDPOINTS.CAMPAIGNS.UPDATE(id), payload);
  return response.data;
};

export const deleteCampaign = async (
  id: string
): Promise<{ status: string; message?: string }> => {
  const response = await Axios.delete(API_ENDPOINTS.CAMPAIGNS.DELETE(id));
  return response.data;
};

export const launchCampaign = async (
  id: string
): Promise<CampaignSingleResponse> => {
  const response = await Axios.patch(API_ENDPOINTS.CAMPAIGNS.LAUNCH(id));
  return response.data;
};

export const pauseCampaign = async (
  id: string
): Promise<CampaignSingleResponse> => {
  const response = await Axios.patch(API_ENDPOINTS.CAMPAIGNS.PAUSE(id));
  return response.data;
};

export const executeCampaign = async (
  id: string
): Promise<CampaignSingleResponse> => {
  const response = await Axios.patch(API_ENDPOINTS.CAMPAIGNS.EXECUTE(id));
  return response.data;
};

export const changeCampaignStatus = async (
  id: string,
  status: string
): Promise<CampaignSingleResponse> => {
  const response = await Axios.patch(API_ENDPOINTS.CAMPAIGNS.CHANGE_STATUS(id), {
    status,
  });
  return response.data;
};