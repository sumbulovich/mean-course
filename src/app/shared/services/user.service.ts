import { SnackBarService } from './snack-bar.service';
import { environment } from './../../../environments/environment';
import { User, Image, AuthData } from '../models';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {
  private user: User;
  private userListener = new Subject<User>();

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) { }

  getUser(): User {
    return this.user;
  }

  getUserListener(): Observable<User> {
    return this.userListener.asObservable();
  }

  /*
  * Add new User on the Database
  */
 createUser( userData: User ): Observable<any> {
    return this.http
      .post<{ message: string }>( BACKEND_URL + 'signup', userData )
      .pipe( map( responseData => {
          console.log( responseData.message );
          return;
      } ) );
  }

  deleteUser(): Observable<any> {
    return this.http
      .delete<{ message: string }>( BACKEND_URL + this.user.id )
      .pipe( map( responseData => {
        console.log( responseData.message );
        return;
    } ) );
  }

  setUser( userId?: string ): void {
    if ( !userId ) {
      this.user = null;
      this.userListener.next( null );
      return;
    }
    this.http
      .get<{ message: string, user: any }>( BACKEND_URL + userId )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.user = { ...this.user, ...{
          id: responseData.user._id,
          firstName: responseData.user.firstName,
          lastName: responseData.user.lastName,
          email: responseData.user.email,
          imagePath: responseData.user.imagePath,
          password: '*'.repeat( responseData.user.passwordLength )
        } };
        this.userListener.next( this.user );
      } );
  }

  updateUser( userData: User, image?: Image ): void {
    const formData = new FormData(); // FormData object accept values and files
    formData.append( 'firstName', userData.firstName );
    formData.append( 'lastName', userData.lastName );
    formData.append( 'imagePath', userData.imagePath );
    if ( image ) {
      const fileName: string =  userData.id;
      formData.append( 'image', image.image, fileName);
      formData.append( 'image', image.thumbnail, fileName);
    }
    this.http
      .put<{ message: string, user: any }>( BACKEND_URL + userData.id, formData )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.user = { ...this.user, ...{
          firstName: responseData.user.firstName,
          lastName: responseData.user.lastName,
          imagePath: responseData.user.imagePath
        } };
        this.userListener.next( this.user );
      }, error => this.userListener.next( null ) ); // We can use PUT or PATCH methods
  }

  updateUserPassword( authData: AuthData ): void {
    this.http
      .put<{ message: string, user: any }>( BACKEND_URL, authData )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.snackBarService.open( responseData.message, null, {
          duration: 3000,
          panelClass: [ 'alert', 'alert-success', 'shadow-sm' ]
        } );
        this.user = { ...this.user, ...{
          password: '*'.repeat( responseData.user.passwordLength )
        } };
        this.userListener.next( this.user );
      }, error => this.userListener.next( null ) ); // We can use PUT or PATCH methods
  }
}
