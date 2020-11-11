import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor( private http: HttpClient ) { }

  sendEmail( data ): void {
    this.http.post<{ message: string }>( BACKEND_URL + 'email', {} )
      .subscribe( responseData => {
        console.log(responseData);
      } );
  }
}
