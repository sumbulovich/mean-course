import { AuthService } from './auth/services/auth.service';
import { filter } from 'rxjs/operators';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent implements OnInit {

  constructor(
    public router: Router,
    private authService: AuthService
  ) {
    this.refreshToken();
  }

  ngOnInit(): void {
    this.authService.autoAuth();
  }

  refreshToken(): void {
    this.router.events.pipe(
      filter( ( event: RouterEvent ) => event instanceof NavigationEnd )
    ).subscribe( () => {
      this.authService.refreshToken();
    } );
  }
}
