import { User } from './../models/auth.model';
import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { API, PATHS } from '../../shared/constants/constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {
  private user: User;
  private userListener = new Subject<User>();

  constructor(
    private http: HttpClient
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
  addUser( user: User ): Observable<any> {
    return this.http
      .post<{ message: string, user: any }>( API.ROOT + API.USERS + PATHS.AUTH.SIGN_UP, user )
      .pipe(
        map( responseData => {
          console.log( responseData.message );
          return;
        } )
      );
  }

  setUser( id: string ): void {
    this.http
      .get<{ message: string, user: any }>( API.ROOT + API.USERS + '/' + id )
      .subscribe( responseData => {
        console.log( responseData.message );
        const userDb = responseData.user;
        this.user = new User( userDb._id, userDb.firstName, userDb.lastName, userDb.email, userDb.imagePath );
        this.userListener.next( this.user );
      } );
  }
}
