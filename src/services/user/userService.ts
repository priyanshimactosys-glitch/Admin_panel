import { API_ENDPOINTS } from "../../lib/api/api-endpoints";
import { Axios } from "../../lib/api/axios";


export interface RolePermission {
  role: "Super Admin" | "Campaign Manager" | "Operator" | "Analyst";
  permissions: number;
  users: number;
}

export interface UserStatsData {
  total_users: number;
  active_users: number;
  inactive_users: number;
  user_roles: number;
  roles_permissions: RolePermission[];
}

export interface UserStatsResponse {
  status: string;
  data: UserStatsData;
}


export type UserRoleType =
  | "Super Admin"
  | "Campaign Manager"
  | "Operator"
  | "Analyst";

export interface UserItem {
  _id: string;
  id: string;
  first_name: string;
  mob: string;
  email: string;
  role_type: UserRoleType;
  permissions: number;
  status: number;
  last_login: string | null;
  campaigns_count: number;
  created_at: string;
  __v?: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role_type?: UserRoleType | string;
  status?: number | string;
}

export interface GetUsersResponse {
  status: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: UserItem[];
}

export interface CreateUserPayload {
  first_name: string;
  mob: string;
  email: string;
  password: string;
  role_type: UserRoleType;
}

export interface UpdateUserPayload {
  first_name?: string;
  mob?: string;
  email?: string;
  password?: string;
  role_type?: UserRoleType;
  status?: number;
}

export interface UserSingleResponse {
  status: string;
  message?: string;
  data: UserItem;
}


export const getUserStats = async (): Promise<UserStatsResponse> => {
  const response = await Axios.get(API_ENDPOINTS.USERS.STATS);
  return response.data;
};

export const getUsers = async (
  params?: GetUsersParams
): Promise<GetUsersResponse> => {
  const response = await Axios.get(API_ENDPOINTS.USERS.LIST, { params });
  return response.data;
};

export const getUserById = async (
  id: string
): Promise<UserSingleResponse> => {
  const response = await Axios.get(API_ENDPOINTS.USERS.DETAIL(id));
  return response.data;
};

export const createUser = async (
  payload: CreateUserPayload
): Promise<UserSingleResponse> => {
  const response = await Axios.post(API_ENDPOINTS.USERS.CREATE, payload);
  return response.data;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<UserSingleResponse> => {
  const response = await Axios.put(API_ENDPOINTS.USERS.UPDATE(id), payload);
  return response.data;
};

export const deleteUser = async (
  id: string
): Promise<{ status: string; message?: string }> => {
  const response = await Axios.delete(API_ENDPOINTS.USERS.DELETE(id));
  return response.data;
};