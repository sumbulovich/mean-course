import { SnackBarService } from '../services/snack-bar.service';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
class ErrorInterceptor implements HttpInterceptor {

  constructor( private snackBarService: SnackBarService ) { }

  intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
    return next.handle( request ).pipe(
      catchError( ( error: HttpErrorResponse ) => {
        this.snackBarService.open( error.error.message, null, {
          duration: 3000,
          panelClass: [ 'alert', 'alert-danger', 'shadow-sm' ]
        } );
        return throwError( error );
      } ) // .catchError operator is provided by Rxjs to handle errors
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
}; // multi as true adds a new Interceptor instead to override the existing ones
