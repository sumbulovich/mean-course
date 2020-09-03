import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API, PATHS } from './../../constants';
import { User } from './../auth.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  /*
  * Add new User on the Database
  */
  addUser( user: User ): Observable<boolean> {
    return this.http
      .post<{ message: string, user: any }>( API.ROOT + API.USERS + PATHS.AUTH.SIGN_UP, user )
      .pipe( map( responseData => {
        console.log( responseData.message );
        return !!responseData.user;
      } ) );
  }
}
