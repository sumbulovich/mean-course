import { PATHS } from 'src/app/shared/constants/globals';
import { environment } from './../../../environments/environment';
import { User, PasswordData } from './../models/auth.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Image } from '../models';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {
  private user: User;
  private userListener = new Subject<User>();

  constructor( private http: HttpClient ) { }

  getUser(): User {
    return this.user;
  }

  getUserListener(): Observable<User> {
    return this.userListener.asObservable();
  }

  /*
  * Add new User on the Database
  */
  addUser( user: User ): Observable<any> {
    return this.http
      .post<{ message: string, user: any }>( BACKEND_URL + 'signup', user )
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

  setUser( id: string ): void {
    this.http
      .get<{ message: string, user: any }>( BACKEND_URL + id )
      .subscribe( responseData => {
        console.log( responseData.message );
        const userDb = responseData.user;
        this.user = new User( userDb._id, userDb.firstName, userDb.lastName,
          userDb.email, userDb.imagePath, '*'.repeat( userDb.passwordLength ) );
        this.userListener.next( this.user );
      } );
  }

  updateUser( user: User, image?: Image ): void {
    const formData = new FormData(); // FormData object accept values and files
    formData.append( 'id', user.id );
    formData.append( 'firstName', user.firstName );
    formData.append( 'lastName', user.lastName );
    formData.append( 'imagePath', user.imagePath );
    if ( image ) {
      const fileName: string =  user.id;
      formData.append( 'image', image.image, fileName);
      formData.append( 'image', image.thumbnail, fileName);
    }
    this.http
      .put<{ message: string }>( BACKEND_URL  + user.id, formData )
      .subscribe( responseData => {
        console.log( responseData.message );
      }, error => this.userListener.next( null ) ); // We can use PUT or PATCH methods
  }

  updateUserPassword( passwordData: PasswordData ): void {
    this.http
      .put<{ message: string }>( BACKEND_URL  + 'password/' + this.user.id, passwordData )
      .subscribe( responseData => {
        console.log( responseData.message );
      }, error => this.userListener.next( null ) ); // We can use PUT or PATCH methods
  }
}
