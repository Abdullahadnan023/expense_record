export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  error?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}