export interface AuthData {
  email: string;
  password: string;
}

export interface LocalStorageData {
  token: string;
  refreshToken: string;
  expiration: string;
}

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor( id: string, firstName: string, lastName: string, email: string, password: string ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}
