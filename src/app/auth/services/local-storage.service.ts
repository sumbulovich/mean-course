import { LocalStorageData } from './../auth.model';
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
    if ( token && refreshToken && expiration ) {
      return { token, refreshToken, expiration };
    }
  }

  /*
  * Delete the Local Storage data
  */
  deleteLocalStorage(): void {
    localStorage.removeItem( 'token' );
    localStorage.removeItem( 'refreshToken' );
    localStorage.removeItem( 'expirationDate' );
  }
}
