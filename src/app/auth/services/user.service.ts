import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
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
  addUser( user: User ): Observable<any> {
    return this.http
      .post<{ message: string, user: any }>( API.ROOT + API.USERS + PATHS.AUTH.SIGN_UP, user );
  }

  getUser( id: string ): Observable<User> {
    return this.http
      .get<{ message: string, user: any }>( API.ROOT + API.USERS + '/' + id )
      .pipe(
        map( responseData => {
          console.log( responseData.message );
          const postDb = responseData.user;
          return new User( postDb._id, postDb.firstName, postDb.lastName, postDb.email, postDb.imagePath );
        }
      ) );
  }
}
