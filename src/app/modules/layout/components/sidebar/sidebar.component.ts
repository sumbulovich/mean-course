import { Link } from './../../../../shared/models/link.model';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() sidenavLinks: Link[];
  @Output() linkClicked = new EventEmitter<Link>();
  @ViewChild('sidenav') sidenav: MatSidenav;
  sidenavLinkSelected: Link;

  constructor() { }

  ngOnInit(): void {
  }

  onSidenavClick( sidenavLink: Link ): void {
    if ( sidenavLink.children ) {
      this.sidenavLinkSelected = sidenavLink;
      this.sidenav.toggle();
      return;
    }
    this.linkClicked.emit( sidenavLink );
  }
}
