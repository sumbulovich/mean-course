import { environment } from 'src/environments/environment';
import { SnackBarService } from './snack-bar.service';
import { DialogData, EmailData } from '../models';
import { DialogComponent } from '../components/dialog/dialog.component';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PATHS, TIMINGS } from '../constants/globals';
import { AuthData, LocalStorageData, User } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import ms from 'ms';

const BACKEND_URL = environment.apiUrl + '/users/';

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
    private dialogService: MatDialog,
    private snackBarService: SnackBarService
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
    this.userService.addUser( user ).subscribe( () => {
      const authData: AuthData = { email: user.email, password: user.password };
      this.signIn( authData );
    }, error => {
      this.authListener.next( false );
    } );
  }

  /*
  * Sign in a User and set a session Token on the Local Storage
  */
  closeAccount(): void {
    this.userService.deleteUser().subscribe( () => {
      this.signOut();
    }, error => {
      this.authListener.next( false );
    } );
  }

  /*
  * Sign in a User and set a session Token on the Local Storage
  */
  signIn( authData: AuthData ): void {
    const expiresIn: number = authData.remember ?
      ms( TIMINGS.TOKEN_EXPIRATION.REMEMBER ) : ms( TIMINGS.TOKEN_EXPIRATION.DEFAULT );
    this.http
      .post<{ message: string, token: string, refreshToken: string, userId: string }>
      ( BACKEND_URL + 'signin', { authData, expiresIn } )
      .subscribe( responseData => {
        console.log( responseData.message );
        const expirationDate: Date = this.dateTimeConverter( expiresIn ) as Date;
        this.setToken( responseData.token, expirationDate );
        this.userService.setUser( responseData.userId );
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
    let expiresIn: number = this.dateTimeConverter( new Date( localStorageData.expiration ) ) as number;
    const refreshDate: Date = this.dateTimeConverter( expiresIn - ms( TIMINGS.TOKEN_EXPIRATION.REFRESH_BEFORE ) ) as Date;
    if ( refreshDate > new Date() ) {
      return; // If refreshTokenTime has not expired
    }

    expiresIn = ms( TIMINGS.TOKEN_EXPIRATION.REFRESH );
    this.http.post<{ message: string, token: string, refreshToken: string, expiresIn: number }>
      ( BACKEND_URL + 'token', { localStorageData, expiresIn } )
      .subscribe( responseData => {
        console.log( responseData.message );
        const expirationDate: Date = this.dateTimeConverter( expiresIn ) as Date;
        this.setToken( responseData.token, expirationDate );

        localStorageData = {
          ...localStorageData,
          token: responseData.token,
          expiration: expirationDate.toISOString()
        };
        this.localStorageService.setLocalStorage( localStorageData );
      }, error => {
        this.signOut();
        // this.snackBarService.open( 'Your session has expired', 'Ok' );
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
      this.userService.setUser( localStorageData.user );
    }
  }

  /*
  * Sign out a User, close the session and clear the Local Storage and the refresh timer
  */
  signOut(): void {
    this.http.post( BACKEND_URL + 'token/reject', this.localStorageService.getLocalStorage() );
    this.setToken( null );
    this.userId = null;
    this.userService.setUser( this.userId );
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
    const dialogRef = this.dialogService.open( DialogComponent, {
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
      this.signOut();
      this.snackBarService.open( 'Your session has expired', 'Ok' );
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
