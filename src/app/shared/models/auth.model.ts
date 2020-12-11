export interface AuthData {
  email: string;
  password: string;
  newPassword?: string;
  remember?: boolean;
  expiresIn?: number;
}

export interface LocalStorageData {
  token: string;
  refreshToken: string;
  expiration: string;
  user: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  imagePath?: string;
  password: string;
}
