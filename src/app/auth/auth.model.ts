export interface AuthData {
  email: string;
  password: string;
}

export interface LocalStorageData {
  token: string;
  expirationDate: Date;
}

export class User {
  email: string;
  password: string;

  constructor( email: string, password: string ) {
    this.email = email;
    this.password = password;
  }
}
