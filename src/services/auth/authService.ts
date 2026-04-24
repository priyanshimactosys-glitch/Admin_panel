import { API_ENDPOINTS } from "../../lib/api/api-endpoints";
import { Axios } from "../../lib/api/axios";

/* ================= LOGIN ================= */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginUser {
  id?: string | number;
  _id?: string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  user?: LoginUser;
  data?: {
    token?: string;
    accessToken?: string;
    user?: LoginUser;
    [key: string]: any;
  };
  [key: string]: any;
}

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await Axios.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  return response.data;
};

/* ================= SIGNUP ================= */

export interface SignupPayload {
  first_name: string;
  mob: string;
  email: string;
  password: string;
  role_type: "Super Admin" | "Campaign Manager" | "Operator" | "Analyst";
}

export interface SignupResponse {
  success?: boolean;
  message?: string;
  data?: any;
  [key: string]: any;
}

export const signupUser = async (
  payload: SignupPayload
): Promise<SignupResponse> => {
  const response = await Axios.post(API_ENDPOINTS.AUTH.SIGNUP, payload);
  return response.data;
};