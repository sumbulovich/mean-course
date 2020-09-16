import { Observable, Subject } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  snackBarListener = new Subject<MatSnackBarRef<any>>();
  constructor( private snackBar: MatSnackBar ) { }

  getSnackBarListener(): Observable<MatSnackBarRef<any>> {
    return this.snackBarListener.asObservable();
  }

  open( message: string, action?: string, config?: MatSnackBarConfig ): void {
    this.snackBarListener.next( this.snackBar.open( message, action, config ) );
  }

  openFromComponent( component: ComponentType<any>, config?: MatSnackBarConfig ): void {
    this.snackBarListener.next( this.snackBar.openFromComponent( component, config ) );
  }

  openFromTemplate( template: TemplateRef<any>, config?: MatSnackBarConfig ): void {
    this.snackBarListener.next( this.snackBar.openFromTemplate( template, config ) );
  }
}
