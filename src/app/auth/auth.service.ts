import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { API, PATHS } from './../constants';
import { User, AuthData, LocalStorageData } from './auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  private token: string;
  private tokenTimer: number;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getToken(): string {
    return this.token;
  }

  private setToken( token: string, expiresIn: number ): void {
    this.token = token;
    this.tokenTimer = setTimeout( () => this.signOut(), expiresIn );
    this.authStatusListener.next( true );
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  addUser( authData: AuthData ): void {
    this.http
      .post<{ message: string, user: any }>( API.ROOT + API.USERS + PATHS.SIGN_UP, authData )
      .subscribe( responseData => {
        console.log( responseData.message );
      } );
  }

  signIn( authData: AuthData ): void {
    this.http
      .post<{ message: string, token: any, expiresIn: number }>( API.ROOT + API.USERS + PATHS.SIGN_IN, authData )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.setToken( responseData.token, responseData.expiresIn );
        const expirationDate: Date = new Date ( new Date().getTime() + responseData.expiresIn );
        this.setLocalStorage( { token: this.token, expirationDate } );
        this.router.navigate( [ PATHS.HOME ] );
      } );
  }

  signOut(): void {
    this.token = null;
    this.authStatusListener.next( false );
    clearTimeout( this.tokenTimer );
    this.removeLocalStorage();
    this.router.navigate( [ PATHS.HOME ] );
  }

  autoAuth(): void {
    const localStorageData: LocalStorageData = this.getLocalStorage();
    if ( !localStorageData ) {
      return;
    }
    const expiresIn: number = localStorageData.expirationDate.getTime() - new Date().getTime();
    if ( expiresIn > 0 ) { // If token is not expired
      this.setToken( localStorageData.token, expiresIn );
    }
  }

  private setLocalStorage( localStorageData: LocalStorageData ): void {
    localStorage.setItem( 'token', localStorageData.token );
    localStorage.setItem( 'expiation', localStorageData.expirationDate.toISOString() );
  }

  private getLocalStorage(): LocalStorageData {
    const token: string = localStorage.getItem( 'token' );
    const expirationDate: Date = new Date( localStorage.getItem( 'expiation' ) );
    if ( token && expirationDate ) {
      return { token, expirationDate };
    }
  }

  private removeLocalStorage(): void {
    localStorage.removeItem( 'token' );
    localStorage.removeItem( 'expiation' );
  }
}
