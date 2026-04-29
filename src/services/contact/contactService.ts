import { API_ENDPOINTS } from "../../lib/api/api-endpoints";
import { Axios } from "../../lib/api/axios";

/* ================= CONTACT LIST TYPES ================= */

export interface ContactListItem {
  _id: string;
  id?: string;
  list_name: string;
  description?: string;
  total_contacts?: number;
  active_contacts?: number;
  created_by?: any;
  created_at?: string;
  updated_at?: string;
  __v?: number;
  [key: string]: any;
}

export interface ContactItem {
  _id: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
  mob?: string;
  email?: string;
  province?: string;
  district?: string;
  age_group?: string;
  language?: string;
  status?: number | string;
  contact_list_id?: string;
  created_at?: string;
  updated_at?: string;
  __v?: number;
  [key: string]: any;
}

/* ================= PARAMS ================= */

export interface GetContactListsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetContactsInListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string | number;
}

export interface GetContactsParams {
  page?: number;
  limit?: number;
  search?: string;
  province?: string;
  district?: string;
  language?: string;
  status?: string | number;
}

/* ================= PAYLOADS ================= */

export interface CreateContactListPayload {
  list_name: string;
  description?: string;
  list_type: string;
  province?: string | null;
}

export interface UpdateContactListPayload {
  list_name?: string;
  description?: string;
}

export interface CreateContactPayload {
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
  mob?: string;
  email?: string;
  province?: string;
  district?: string;
  age_group?: string;
  language?: string;
  contact_list_id?: string;
  status?: number | string;
  [key: string]: any;
}

export interface UpdateContactPayload extends Partial<CreateContactPayload> {}

/* ================= RESPONSES ================= */

export interface ContactListResponse {
  status: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data: ContactListItem[];
}

export interface ContactListSingleResponse {
  status: string;
  message?: string;
  data: ContactListItem;
}

export interface ContactResponse {
  status: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data: ContactItem[];
}

export interface ContactSingleResponse {
  status: string;
  message?: string;
  data: ContactItem;
}

export interface ContactStatsData {
  total_contacts?: number;
  active_contacts?: number;
  inactive_contacts?: number;
  total_lists?: number;
  [key: string]: any;
}

export interface ContactStatsResponse {
  status: string;
  data: ContactStatsData;
}

export interface ImportContactsResponse {
  status: string;
  message?: string;
  data?: any;
}


/* ================= CONTACT LIST API ================= */

export const getContactLists = async (
  params?: GetContactListsParams
): Promise<ContactListResponse> => {
  const response = await Axios.get(API_ENDPOINTS.CONTACTS.LISTS, { params });
  return response.data;
};

export const createContactList = async (
  payload: CreateContactListPayload
): Promise<ContactListSingleResponse> => {
  const response = await Axios.post(API_ENDPOINTS.CONTACTS.CREATE_LIST, payload);
  return response.data;
};

export const getContactListById = async (
  id: string
): Promise<ContactListSingleResponse> => {
  const response = await Axios.get(API_ENDPOINTS.CONTACTS.LIST_DETAIL(id));
  return response.data;
};

export const updateContactList = async (
  id: string,
  payload: UpdateContactListPayload
): Promise<ContactListSingleResponse> => {
  const response = await Axios.put(API_ENDPOINTS.CONTACTS.UPDATE_LIST(id), payload);
  return response.data;
};

export const deleteContactList = async (
  id: string
): Promise<{ status: string; message?: string }> => {
  const response = await Axios.delete(API_ENDPOINTS.CONTACTS.DELETE_LIST(id));
  return response.data;
};

export const importContactsIntoList = async (
  listId: string,
  file: File
): Promise<ImportContactsResponse> => {
  const formData = new FormData();
  formData.append("list_id", listId);
  formData.append("file", file);

  const response = await Axios.post(
    API_ENDPOINTS.CONTACTS.IMPORT_LIST(listId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getContactsInList = async (
  listId: string,
  params?: GetContactsInListParams
): Promise<ContactResponse> => {
  const response = await Axios.get(API_ENDPOINTS.CONTACTS.LIST_CONTACTS(listId), {
    params,
  });
  return response.data;
};

/* ================= INDIVIDUAL CONTACT API ================= */

export const createContact = async (
  payload: CreateContactPayload
): Promise<ContactSingleResponse> => {
  const response = await Axios.post(API_ENDPOINTS.CONTACTS.CREATE_CONTACT, payload);
  return response.data;
};

export const getContactById = async (
  id: string
): Promise<ContactSingleResponse> => {
  const response = await Axios.get(API_ENDPOINTS.CONTACTS.CONTACT_DETAIL(id));
  return response.data;
};

export const updateContact = async (
  id: string,
  payload: UpdateContactPayload
): Promise<ContactSingleResponse> => {
  const response = await Axios.put(API_ENDPOINTS.CONTACTS.UPDATE_CONTACT(id), payload);
  return response.data;
};

export const deleteContact = async (
  id: string
): Promise<{ status: string; message?: string }> => {
  const response = await Axios.delete(API_ENDPOINTS.CONTACTS.DELETE_CONTACT(id));
  return response.data;
};

export const getContactStats = async (): Promise<ContactStatsResponse> => {
  const response = await Axios.get(API_ENDPOINTS.CONTACTS.STATS);
  return response.data;
};