import { BaseDialogComponent } from './../../dialogs/dialogs.component';
import { Subject, Observable } from 'rxjs';
import { LocalStorageData } from './../auth.model';
import { DialogData } from './../../dialogs/dialog.model';
import { API, PATHS, TIMINGS } from './../../constants';
import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import ms from 'ms';

@Injectable( {
  providedIn: 'root'
} )
export class TokenService {
  private token: string;
  private tokenTimer: number;
  private tokenListener = new Subject<string>();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
  ) { }

  /*
  * Return the Token for Authentication
  */
  getToken(): string {
    return this.token;
  }

  /*
  * Return a listener of the Authentication status updated when
  */
  getTokenListener(): Observable<string> {
    return this.tokenListener.asObservable();
  }

  addToken( token: string, refreshToken: string, expiresIn: number | string ): void {
    const expirationDate: Date = this.dateTimeConverter( ms( expiresIn ) ) as Date;
    this.setToken( token, expirationDate );
    const localStorageData: LocalStorageData = {
      token,
      refreshToken,
      expiration: expirationDate.toISOString()
    };
    this.localStorageService.setLocalStorage( localStorageData );
  }

  deleteToken(): void {
    this.http.post<{ message: string }>( API.ROOT + API.USERS + PATHS.AUTH.TOKEN_REJECT, this.localStorageService.getLocalStorage() );
    this.token = null;
    this.tokenListener.next( null );
    this.localStorageService.deleteLocalStorage();
    clearTimeout( this.tokenTimer );
  }

  /*
  * Authenticate if the Local Storage's data it's not expired
  */
  autoAuth(): void {
    const localStorageData: LocalStorageData = this.localStorageService.getLocalStorage();
    if ( !localStorageData ) {
      return;
    }
    const expirationDate = new Date( localStorageData.expiration );
    if ( expirationDate > new Date() ) { // If token is not expired
      this.setToken( localStorageData.token, expirationDate );
    }
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
        }; // Update token and expiration of our current Local Storage Data
        this.localStorageService.setLocalStorage( localStorageData );
      } );
  }

  /*
  * Set a session Token and prepare the Expire Token Dialog to be trigger
  */
  private setToken( token: string, expirationDate: Date ): void {
    if ( !this.token ) {
      this.tokenListener.next( token );
    }
    this.token = token;

    if ( this.tokenTimer ) {
      clearTimeout( this.tokenTimer );
    }
    const triggerDialogIn: number = this.dateTimeConverter( expirationDate ) as number - ms( TIMINGS.TOKEN_EXPIRATION.DIALOG_BEFORE );
    this.tokenTimer = setTimeout( () => {
      this.triggerExpireTokenDialog( expirationDate );
    }, triggerDialogIn );
  }

  /*
    * Open Expire Token Dialog, update the timer and set the Dialog closing subscription
    */
  private triggerExpireTokenDialog( expirationDate: Date ): void {
    let expiresIn: number = this.dateTimeConverter( expirationDate ) as number;
    expiresIn = Math.floor( expiresIn / 1000 ) * 1000; // Remove decimals

    const dialogData = {
      title: 'Your session is about to expire.',
      content: 'You will be logged out in <strong>' + expiresIn / 1000 + '</strong> seconds.',
      confirmButton: { text: 'Keep me logged in', color: 'primary' }
    } as DialogData;

    const dialogRef = this.dialog.open( BaseDialogComponent, {
      data: dialogData,
      disableClose: true // Whether the user can use escape or clicking on the backdrop to close the dialog.
    } );

    const interval = 1000;
    const contDown = Number( setInterval( () => {
      expiresIn = expiresIn - interval;
      dialogRef.componentInstance.data.content = 'You will be logged out in <strong>' + expiresIn / 1000 + '</strong> seconds.';
      if ( expiresIn <= 0 ) {
        dialogRef.close();
      }
    }, interval ) );

    dialogRef.afterClosed().subscribe( ( result: boolean ) => {
      clearInterval( contDown );
      if ( !result ) {
        this.deleteToken();
        this.dialog.open( BaseDialogComponent, {
          data: {
            content: 'Your session has expired',
            cancelButton: { text: 'Ok' }
          } as DialogData
        } );
        return;
      }
      this.refreshToken();
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
