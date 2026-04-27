
export const API_ENDPOINTS = {
  VOICE_MESSAGES: {
    GET_ALL: "/voice-lib",
    CREATE: "/voice-lib",
    DELETE: (id: string | number) => `/voice-messages/${id}`,
  },
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/register",
  },
  DASHBOARD: {
    GET_DASHBOARD: "/dashboard",
  },
  USERS: {
    STATS: "/users/stats",
    LIST: "/users",
    CREATE: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings",
  },
};