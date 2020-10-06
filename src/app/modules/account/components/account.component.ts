import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PATHS } from 'src/app/shared/constants/globals';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component( {
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: [ './account.component.scss' ]
} )
export class AccountComponent implements OnInit {
  PATHS = PATHS;
  isDrawer: boolean;

  constructor( private breakpointObserver: BreakpointObserver ) {
    this.breakpointObserver.observe( [ Breakpoints.XSmall ] )
      .subscribe( result => {
        this.isDrawer = result.matches;
      } );
  }

  ngOnInit(): void {
  }
}
