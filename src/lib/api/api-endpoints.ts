
export const API_ENDPOINTS = {
  VOICE_MESSAGES: {
    GET_ALL: "/voice-lib",
    CREATE: "/voice-lib",
    UPDATE: (id: string | number) => `/voice-lib/${id}`,
    DELETE: (id: string | number) => `/voice-lib/${id}`,
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
  CAMPAIGNS: {
    STATS: "/campaigns/stats",
    RECENT: "/campaigns/recent",
    TOP_PERFORMANCE: "/campaigns/top-performance",

    LIST: "/campaigns",
    CREATE: "/campaigns",
    SAVE_DRAFT: "/campaigns/draft",

    DETAIL: (id: string) => `/campaigns/${id}`,
    UPDATE: (id: string) => `/campaigns/${id}`,
    DELETE: (id: string) => `/campaigns/${id}`,

    LAUNCH: (id: string) => `/campaigns/${id}/launch`,
    PAUSE: (id: string) => `/campaigns/${id}/pause`,
    CHANGE_STATUS: (id: string) => `/campaigns/${id}/status`,
    EXECUTE: (id: string) => `/campaigns/${id}/execute`,
  },
  CONTACTS: {
    LISTS: "/contact-lists",
    CREATE_LIST: "/contact-lists",
    LIST_DETAIL: (id: string) => `/contact-lists/${id}`,
    UPDATE_LIST: (id: string) => `/contact-lists/${id}`,
    DELETE_LIST: (id: string) => `/contact-lists/${id}`,
    IMPORT_LIST: (id: string) => `/contact-lists/import`,
    LIST_CONTACTS: (id: string) => `/contact-lists/${id}/contacts`,

    CREATE_CONTACT: "/contacts",
    CONTACT_DETAIL: (id: string) => `/contacts/${id}`,
    UPDATE_CONTACT: (id: string) => `/contacts/${id}`,
    DELETE_CONTACT: (id: string) => `/contacts/${id}`,
    STATS: "/contacts/stats",
  },
};