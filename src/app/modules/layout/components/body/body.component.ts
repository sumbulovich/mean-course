import { AuthService, LoadingService, SnackBarService } from 'src/app/shared/services';
import { filter } from 'rxjs/operators';
import { Router, RouterEvent, NavigationStart } from '@angular/router';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: [ './body.component.scss' ]
} )
export class BodyComponent implements OnInit {
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
