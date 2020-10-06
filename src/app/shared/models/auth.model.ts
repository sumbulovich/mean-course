export interface AuthData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface PasswordData {
  password: string;
  newPassword: string;
}

export interface LocalStorageData {
  token: string;
  refreshToken: string;
  expiration: string;
  user: string;
}

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imagePath: string;
  password: string;

  constructor( id: string, firstName: string, lastName: string, email?: string, imagePath?: string, password?: string ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.imagePath = imagePath;
    this.password = password;
  }
}
