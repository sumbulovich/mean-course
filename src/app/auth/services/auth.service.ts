import { UserService } from './user.service';
import { DialogData } from './../../dialogs/dialog.model';
import { BaseDialogComponent } from './../../dialogs/dialogs.component';
import { LocalStorageService } from './local-storage.service';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { API, PATHS, TIMINGS } from './../../constants';
import { AuthData, LocalStorageData, User } from './../auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import ms from 'ms';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  private token: string;
  private tokenTimer: number;
  private userId: string;
  private authListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

  /*
  * Return the Token for Authentication
  */
  getToken(): string {
    return this.token;
  }

  /*
  * Return the User Authenticated
  */
  getUserId(): string {
    return this.userId;
  }

  /*
  * Return a listener of the Authentication
  */
  getAuthListener(): Observable<boolean> {
    return this.authListener.asObservable();
  }

  /*
  * Sign in a User and set a session Token on the Local Storage
  */
  signUp( user: User ): void {
    this.userService.addUser( user ).subscribe( responseData => {
      console.log( responseData.message );
      const authData: AuthData = { email: user.email, password: user.password };
      this.signIn( authData );
    }, error => {
      console.log( 'error signUp');
      this.authListener.next( false );
    } );
  }

  /*
  * Sign in a User and set a session Token on the Local Storage
  */
  signIn( authData: AuthData ): void {
    this.http
      .post<{ message: string, token: string, refreshToken: string, userId: string }>
      ( API.ROOT + API.USERS + PATHS.AUTH.SIGN_IN, { user: authData, expiresIn: TIMINGS.TOKEN_EXPIRATION.TIME } )
      .subscribe( responseData => {
        console.log( responseData.message );
        const expirationDate: Date = this.dateTimeConverter( ms( TIMINGS.TOKEN_EXPIRATION.TIME ) ) as Date;
        this.setToken( responseData.token, expirationDate );
        this.userId = responseData.userId;
        const localStorageData: LocalStorageData = {
          token: responseData.token,
          refreshToken: responseData.refreshToken,
          expiration: expirationDate.toISOString(),
          user: responseData.userId
        };
        this.localStorageService.setLocalStorage( localStorageData );
        this.router.navigate( [ PATHS.HOME ] );
      }, error => {
        console.log( 'error signIn');
        this.authListener.next( false );
      } );
  }

  /*
  * Refresh Local Storage with new data
  */
  refreshToken(): void {
    let localStorageData: LocalStorageData = this.localStorageService.getLocalStorage();
    if ( !localStorageData ) {
      return; // If there is not Local Storage data
    }
    const expiresIn: number = this.dateTimeConverter( new Date( localStorageData.expiration ) ) as number;
    const refreshDate: Date = this.dateTimeConverter( expiresIn - ms( TIMINGS.TOKEN_EXPIRATION.REFRESH_BEFORE ) ) as Date;
    if ( refreshDate > new Date() ) {
      return; // If refreshTokenTime has not expired
    }

    this.http.post<{ message: string, token: string, refreshToken: string, expiresIn: number }>
      ( API.ROOT + API.USERS + PATHS.AUTH.TOKEN, { localStorage: localStorageData, expiresIn: TIMINGS.TOKEN_EXPIRATION.TIME } )
      .subscribe( responseData => {
        console.log( responseData.message );
        const expirationDate: Date = this.dateTimeConverter( ms( TIMINGS.TOKEN_EXPIRATION.TIME ) ) as Date;
        this.setToken( responseData.token, expirationDate );

        localStorageData = {
          ...localStorageData,
          token: responseData.token,
          expiration: expirationDate.toISOString()
        };
        this.localStorageService.setLocalStorage( localStorageData );
      }, error => {
        console.log( 'error refreshToken');
        this.triggerExpiredTokenDialog();
        this.signOut();
      } );
  }

  /*
  * Authenticate if the Local Storage's data it's not expired
  */
  autoAuth(): void {
    const localStorageData: LocalStorageData = this.localStorageService.getLocalStorage();
    if ( !localStorageData ) {
      this.authListener.next( false );
      return;
    }
    const expirationDate = new Date( localStorageData.expiration );
    if ( expirationDate > new Date() ) { // If token is not expired
      this.setToken( localStorageData.token, expirationDate );
      this.userId = localStorageData.user;
    }
  }

  /*
  * Sign out a User, close the session and clear the Local Storage and the refresh timer
  */
  signOut(): void {
    this.http.post( API.ROOT + API.USERS + PATHS.AUTH.TOKEN_REJECT, this.localStorageService.getLocalStorage() );
    this.setToken( null );
    this.userId = null;
    this.localStorageService.deleteLocalStorage();
    this.router.navigate( [ PATHS.HOME ] );
  }

  /*
  * Set a session Token and prepare the Expire Token Dialog to be trigger
  */
  private setToken( token: string, expirationDate?: Date ): void {
    this.token = token;
    this.authListener.next( !!token );
    clearTimeout( this.tokenTimer );

    if ( expirationDate ) {
      const triggerDialogIn: number =
        this.dateTimeConverter( expirationDate ) as number - ms( TIMINGS.TOKEN_EXPIRATION.DIALOG_BEFORE );
      this.tokenTimer = setTimeout( () => {
        this.triggerExpireTokenDialog( expirationDate );
      }, triggerDialogIn );
    }
  }

  /*
  * Open a Expiration Token Dialog with a timer
  */
  private triggerExpireTokenDialog( expirationDate: Date ): void {
    const dialogContent = 'You will be logged out in <strong>%expireSeconds%</strong> seconds.';
    const interval: number = ms( '1s' );
    const expireSeconds: number = ( ms( TIMINGS.TOKEN_EXPIRATION.DIALOG_BEFORE ) ) / 1000;
    const dialogRef = this.dialog.open( BaseDialogComponent, {
      data: {
        title: 'Your session is about to expire',
        content: dialogContent.replace( '%expireSeconds%', expireSeconds.toString() ),
        confirmButton: { text: 'Keep me logged in', color: 'primary' }
      } as DialogData,
      disableClose: true // Whether the user can use escape or clicking on the backdrop to close the dialog.
    } );

    let expiresIn: number;
    const contDown = Number( setInterval( () => {
      if ( expiresIn < interval ) {
        dialogRef.close();
      }
      expiresIn = expiresIn ? expiresIn - interval : this.dateTimeConverter( expirationDate ) as number;
      dialogRef.componentInstance.data.content =
        dialogContent.replace( '%expireSeconds%', Math.ceil( expiresIn / 1000 ).toString() );
    }, interval ) );

    dialogRef.afterClosed().subscribe( ( isConfirmButton: boolean ) => {
      clearInterval( contDown );
      if ( isConfirmButton ) {
        this.refreshToken();
        return;
      }
      this.triggerExpiredTokenDialog();
      this.signOut();
    } );
  }

  private triggerExpiredTokenDialog(): void {
    this.dialog.open( BaseDialogComponent, {
      data: {
        content: 'Your session has expired',
        cancelButton: { text: 'Ok' }
      } as DialogData
    } );
  }

  /*
  * Convert time to date and vice versa
  */
  private dateTimeConverter( dateTime: Date | number ): Date | number {
    if ( typeof dateTime === 'number' ) {
      return new Date( new Date().getTime() + dateTime );
    } else {
      return dateTime.getTime() - new Date().getTime();
    }
  }
}
