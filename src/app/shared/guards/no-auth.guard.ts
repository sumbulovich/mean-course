import { AuthService } from '../services/auth.service';
import { PATHS } from '../constants/globals';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  getIsNoAuthenticated(): boolean {
    const isAuthenticated: boolean = !!this.authService.getToken();
    if ( isAuthenticated ) {
      this.router.navigate( [ PATHS.HOME ] );
    }
    return !isAuthenticated;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.getIsNoAuthenticated();
  }
}
