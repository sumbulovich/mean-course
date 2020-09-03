import { TokenService } from './auth/services/token.service';
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
    private tokenService: TokenService
  ) {
    this.refreshToken();
  }

  ngOnInit(): void {
    this.tokenService.autoAuth();
  }

  refreshToken(): void {
    this.router.events.pipe(
      filter( ( event: RouterEvent ) => event instanceof NavigationEnd )
    ).subscribe( () => {
      this.tokenService.refreshToken();
    } );
  }
}
