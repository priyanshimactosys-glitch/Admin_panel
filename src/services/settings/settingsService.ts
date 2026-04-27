import { API_ENDPOINTS } from "../../lib/api/api-endpoints";
import { Axios } from "../../lib/api/axios";


export interface SettingsData {
    system_name: string;
    organization: string;
    timezone: string;
    default_language: string;
    date_format: string;
    country: string;
    currency: string;
    default_caller_id: string;
    default_retry_attempts: number;
    default_call_timeout: number;
    cost_per_call: number;
    email_notifications: boolean;
    sms_notifications: boolean;
    notify_on_complete: boolean;
    notify_on_fail: boolean;

    _id?: string;
    updated_by?: string | null;
    updated_at?: string;
    __v?: number;
}

export interface SettingsResponse {
    status: string;
    data: SettingsData;
    message?: string;
}


export const getSettings = async (): Promise<SettingsResponse> => {
    const response = await Axios.get(API_ENDPOINTS.SETTINGS.GET);
    return response.data;
};

export const updateSettings = async (
    payload: SettingsData
): Promise<SettingsResponse> => {
    const response = await Axios.put(API_ENDPOINTS.SETTINGS.UPDATE, payload);
    return response.data;
};