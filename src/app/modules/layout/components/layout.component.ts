import { EmailComponent } from 'src/app/shared/components/email/email.component';
import { SidenavService } from 'src/app/shared/services';
import { ACCOUNT_LINKS } from 'src/app/shared/constants/globals';
import { filter } from 'rxjs/operators';
import { AuthService, LoadingService, SnackBarService, CodeService } from 'src/app/shared/services';
import { EmailData, Link } from 'src/app/shared/models';
import { Router, RouterEvent, NavigationStart } from '@angular/router';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver, ViewContainerRef, ComponentRef, Type } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';

@Component( {
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: [ './layout.component.scss' ]
} )
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild( 'drawer' ) drawer: MatDrawer;
  @ViewChild( 'emailContainer', { read: ViewContainerRef } )
    emailContainer: ViewContainerRef;
  isDomReady: boolean;
  isLoading: boolean;
  headerSidenavLinks: Link[];
  toolbarSidenavLinks: Link[];
  bpState: BreakpointState;
  readonly Breakpoints = Breakpoints;
  private snackBarRef: MatSnackBarRef<any>;
  private snackBarListenerSub: Subscription;
  private sidenavListenerSub: Subscription;
  private loadingListenerSub: Subscription;

  constructor(
    public router: Router,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private loadingService: LoadingService,
    private sidenavService: SidenavService,
    private codeService: CodeService
  ) {
    this.router.events.pipe(
      filter( ( routerEvent: RouterEvent ) => routerEvent instanceof NavigationStart )
    ).subscribe( () => {
      this.authService.refreshToken();
      if ( this.snackBarRef ) {
        this.snackBarRef.dismiss();
      }
    } );
    this.breakpointObserver.observe( [ Breakpoints.XSmall, Breakpoints.Small ] )
      .subscribe( ( result: BreakpointState ) => {
        this.bpState = result;
      } );
  }

  ngOnInit(): void {
    this.headerSidenavLinks = [
      { content: 'Account', icon: 'account_circle', children: ACCOUNT_LINKS },
      { content: 'Log out', icon: 'power_settings_new', action: this.signOut }
    ];

    this.authService.autoAuth();

    this.loadingListenerSub = this.loadingService.getLoadingListener()
      .subscribe( ( isLoading: boolean ) => this.isLoading = isLoading );

    this.snackBarListenerSub = this.snackBarService.getSnackBarListener()
      .subscribe( ( snackBarRef: MatSnackBarRef<any> ) => this.snackBarRef = snackBarRef );

    this.sidenavListenerSub = this.sidenavService.getSidenavListener()
      .subscribe( ( sidenavLinks: Link[] ) => {
        if ( !sidenavLinks ) {
          this.drawer.close();
        }
        setTimeout( () => {
          this.toolbarSidenavLinks = sidenavLinks;
        } );
      } );

    setTimeout( () => {
      this.isDomReady = true;
      this.codeService.setEmailContainer( this.emailContainer );
    } );
  }

  onLinkClicked( link: Link ): void {
    if ( link.action ) {
      link.action.call( this );
    }
    if ( this.bpState.breakpoints[ Breakpoints.XSmall ] ) {
      this.drawer.close();
    }
  }

  signOut(): void {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.snackBarListenerSub.unsubscribe();
    this.sidenavListenerSub.unsubscribe();
    this.loadingListenerSub.unsubscribe();
  }
}
