
export const API_ENDPOINTS = {
  VOICE_MESSAGES: {
    GET_ALL: "/voice-lib",
    CREATE: "/voice-lib",
    DELETE: (id: string | number) => `/voice-messages/${id}`,
  },
  AUTH:{
    LOGIN: "/auth/login",
    SIGNUP: "/auth/register",
  }
};