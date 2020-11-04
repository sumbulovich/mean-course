import { LoadingService } from './../../../shared/services/loading.service';
import { ACCOUNT_LINKS } from './../../../shared/constants/globals';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component( {
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: [ './account.component.scss' ]
} )
export class AccountComponent implements OnInit, OnDestroy {

  constructor(
    private sidenavService: SidenavService
  ) {}

  ngOnInit(): void {
    this.sidenavService.setSidenav( ACCOUNT_LINKS );
  }

  ngOnDestroy(): void {
    this.sidenavService.setSidenav();
  }
}
