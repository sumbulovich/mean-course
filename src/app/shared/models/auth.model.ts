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
