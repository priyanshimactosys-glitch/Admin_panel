// src/services/voice-library/voice-library.service.ts

import { API_ENDPOINTS } from "../../lib/api/api-endpoints";
import { Axios } from "../../lib/api/axios";

export interface VoiceMessageItem {
  id?: number | string;
  data?: any;
  _id?: string;
  message_name: string;
  lang: string;
  category: string;
  description?: string;
  audio_file?: string;
  audio_url?: string;
  file_url?: string;
  duration?: string;
  size?: string;
  file_size?: number;
  uploadDate?: string;
  createdAt?: string;
  created_date?: string;
  usageCount?: number;
  status?: string;
}

export interface GetVoiceMessagesResponse {
  success?: boolean;
  data?: VoiceMessageItem[];
  items?: VoiceMessageItem[];
}

export interface UploadVoiceMessagePayload {
  message_name: string;
  lang: string;
  category: string;
  description: string;
  audio_file: File;
}

export interface UpdateVoiceMessagePayload {
  message_name?: string;
  lang?: string;
  category?: string;
  description?: string;
  audio_file?: File | null;
  status?: string;
}

export const getVoiceMessages = async (): Promise<GetVoiceMessagesResponse> => {
  const response = await Axios.get(API_ENDPOINTS.VOICE_MESSAGES.GET_ALL);
  return response.data;
};

export const uploadVoiceMessage = async (
  payload: UploadVoiceMessagePayload
) => {
  const formData = new FormData();

  formData.append("message_name", payload.message_name);
  formData.append("lang", payload.lang);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("audio_file", payload.audio_file);

  const response = await Axios.post(
    API_ENDPOINTS.VOICE_MESSAGES.CREATE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateVoiceMessage = async (
  id: string | number,
  payload: UpdateVoiceMessagePayload
) => {
  const formData = new FormData();

  if (payload.message_name !== undefined) {
    formData.append("message_name", payload.message_name);
  }

  if (payload.lang !== undefined) {
    formData.append("lang", payload.lang);
  }

  if (payload.category !== undefined) {
    formData.append("category", payload.category);
  }

  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }

  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  if (payload.audio_file) {
    formData.append("audio_file", payload.audio_file);
  }

  const response = await Axios.put(
    API_ENDPOINTS.VOICE_MESSAGES.UPDATE(id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteVoiceMessage = async (id: string | number) => {
  const response = await Axios.delete(API_ENDPOINTS.VOICE_MESSAGES.DELETE(id));
  return response.data;
};