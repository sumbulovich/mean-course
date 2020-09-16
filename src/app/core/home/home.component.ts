import { LoadingService } from './../../shared/services/loading.service';
import { AuthService } from './../../shared/services/auth.service';
import { filter } from 'rxjs/operators';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { Router, NavigationEnd, RouterEvent, NavigationStart } from '@angular/router';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component( {
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
} )
export class HomeComponent implements OnInit {
  private snackBarRef: MatSnackBarRef<any>;

  constructor(
    public router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private loadingService: LoadingService
  ) {
    this.router.events.pipe(
      filter( ( event: RouterEvent ) => event instanceof NavigationStart )
    ).subscribe( () => {
      this.authService.refreshToken();
      this.loadingService.setLoadingListener( true );
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
