import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { API, PATHS, TIMINGS } from './../../constants';
import { AuthData } from './../auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) { }

  /*
  * Sign in a User and set a session Token on the Local Storage
  */
  signIn( authData: AuthData ): void {
    this.http
      .post<{ message: string, token: string, refreshToken: string, expiresIn: number }>
      ( API.ROOT + API.USERS + PATHS.AUTH.SIGN_IN, { user: authData, expiresIn: TIMINGS.TOKEN_EXPIRATION.TIME } )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.tokenService.addToken( responseData.token, responseData.refreshToken, TIMINGS.TOKEN_EXPIRATION.TIME );
        this.router.navigate( [ PATHS.HOME ] );
      } );
  }

  /*
  * Sign out a User, close the session and clear the Local Storage and the refresh timer
  */
  signOut(): void {
    this.tokenService.deleteToken();
    this.router.navigate( [ PATHS.HOME ] );
  }
}
