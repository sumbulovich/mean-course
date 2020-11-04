import { Subject, Observable } from 'rxjs';
import { Link } from './../models/link.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenavListener = new Subject<Link[]>();

  constructor() { }

  setSidenav( links?: Link[] ): void {
    this.sidenavListener.next( links );
  }

  getSidenavListener(): Observable<Link[]> {
    return this.sidenavListener.asObservable();
  }
}
