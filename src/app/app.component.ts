import { MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarService } from './snack-bar.service';
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
  snackBarRef: MatSnackBarRef<any>;

  constructor(
    public router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {
    this.router.events.pipe(
      filter( ( event: RouterEvent ) => event instanceof NavigationEnd )
    ).subscribe( () => {
      this.authService.refreshToken();
      if ( this.snackBarRef ) {
        this.snackBarRef.dismiss();
      }
    } );
  }

  ngOnInit(): void {
    this.authService.autoAuth();
    this.snackBarService.getSnackBarListener().subscribe( ( snackBarRef: MatSnackBarRef<any> ) => {
      this.snackBarRef = snackBarRef;
    } );
  }
}
