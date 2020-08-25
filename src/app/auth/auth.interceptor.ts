import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private authService: AuthService ) { }

  intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
    const authToken: string = this.authService.getToken();
    const authRequest: HttpRequest<unknown> = request.clone( {
      headers: request.headers.set( 'Authorization', 'Bearer ' + authToken ) // 'Bearer ' + authToken it's just a convention
      // Same header as req.headers.authorization of check-auth (case unsensitive)
      // .set methods adds a new header or override it if already exist
    } );
    return next.handle( authRequest );
  }
}