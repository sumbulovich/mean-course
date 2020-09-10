import { Subscription } from 'rxjs';
import { AuthService } from './../auth/services/auth.service';
import { PATHS } from './../constants';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component( {
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
} )
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  readonly PATHS = PATHS;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = !!this.authService.getToken(); // Get initial authenticated state
    this.authListenerSubs = this.authService.getAuthListener()
      .subscribe( ( isAuth: boolean ) => {
        this.isAuthenticated = isAuth;
      } );
  }

  onSignOut(): void {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    if ( this.authListenerSubs ) {
      this.authListenerSubs.unsubscribe();
    }
  }
}
