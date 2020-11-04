import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { PATHS } from '../constants/globals';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated: boolean = !!this.authService.getToken();
    if ( !isAuthenticated ) {
      this.router.navigate( [ PATHS.AUTH.ROOT + '/' + PATHS.AUTH.SIGN_IN ] );
    }
    return isAuthenticated;
  }
}
