import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PATHS } from 'src/app/shared/constants/constants';

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
