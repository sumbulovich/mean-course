import { LocalStorageData } from './../models/auth.model';
import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class LocalStorageService {

  constructor() { }

  /*
  * Set the Local Storage data
  */
  setLocalStorage( localStorageData: LocalStorageData ): void {
    Object.keys( localStorageData ).forEach( ( key: string ) => {
      localStorage.setItem( key, localStorageData[ key ] );
    } );
  }

  /*
  * Get the Local Storage data
  */
  getLocalStorage(): LocalStorageData {
    const token: string = localStorage.getItem( 'token' );
    const refreshToken: string = localStorage.getItem( 'refreshToken' );
    const expiration: string = localStorage.getItem( 'expiration' );
    const user: string = localStorage.getItem( 'user' );
    if ( token && refreshToken && expiration && user ) {
      return { token, refreshToken, expiration, user };
    }
  }

  /*
  * Delete the Local Storage data
  */
  deleteLocalStorage(): void {
    localStorage.removeItem( 'token' );
    localStorage.removeItem( 'refreshToken' );
    localStorage.removeItem( 'expiration' );
    localStorage.removeItem( 'user' );
  }
}
