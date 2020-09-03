import { TokenService } from './../auth/services/token.service';
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
    private tokenService: TokenService,
    private authService: AuthService
     ) { }

  ngOnInit(): void {
    this.isAuthenticated = !!this.tokenService.getToken(); // Get initial authenticated state
    this.authListenerSubs = this.tokenService.getTokenListener()
      .subscribe( ( token: string ) => {
        this.isAuthenticated = !!token;
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
