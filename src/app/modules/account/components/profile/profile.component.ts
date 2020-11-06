import { take, map } from 'rxjs/operators';
import { UrlTree } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ImageSettings } from './../../../../shared/models/image.model';
import { PATHS } from 'src/app/shared/constants/globals';
import { FormComponent } from 'src/app/shared/components';
import { Animations } from 'src/app/shared/constants/animations';
import { UserService } from 'src/app/shared/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models';
import { Component, OnInit, OnDestroy } from '@angular/core';

enum Mode { read, write }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [ Animations.fadeAnimation ]
})
export class ProfileComponent extends FormComponent implements OnInit, OnDestroy {
  user: User;
  modeTypes = Mode;
  mode: Mode;
  thumbnailImageSettings = new ImageSettings( 40, 40 );
  readonly PATHS = PATHS;
  private userListenerSub: Subscription;

  constructor(
    private userService: UserService,
    dialogService: MatDialog
  ) {
    super( dialogService );
  }

  ngOnInit(): void {
    this.form = new FormGroup( {
      firstName: new FormControl( '', {
        validators: [ Validators.required ]
      } ),
      lastName: new FormControl( '', {
        validators: [ Validators.required ]
      } )
    } );

    this.user = this.userService.getUser();
    if ( this.user ) {
      this.imagePreview = this.user.imagePath;
      this.setForm( this.user );
    }

    this.setMode( Mode.read );
    this.userListenerSub = this.userService.getUserListener()
      .subscribe( ( user: User ) => {
        if ( !user ) {
          this.showFormError( 'Error' );
          this.form.enable();
          this.isSaved = false;
          return;
        }
        this.user = user;
        this.imagePreview = this.user.imagePath;
        this.setMode( Mode.read );
        this.setForm( this.user );
      } );
  }

  setMode( mode: Mode ): void {
    this.mode = mode;
    this.isSaved = false;
    mode === Mode.write ? this.form.enable() : this.form.disable();
  }

  onCancel(): void {
    if ( !this.hasChanges( this.user, this.getCurrentUser() ) ) {
      this.setForm( this.user );
      this.setMode( Mode.read );
      return;
    }
    this.triggerDiscardChangesDialog().afterClosed()
      .subscribe( ( isConfirmButton: boolean ) => {
        if ( isConfirmButton ) {
          this.setForm( this.user );
          this.setMode( Mode.read );
        }
      } );
  }

  getCurrentUser(): User {
    return { ...this.user, ...{
      firstName: this.form.value.firstName.trim(),
      lastName: this.form.value.lastName.trim(),
      imagePath: this.imagePreview,
    } };
  }

  onSave(): void {
    if ( this.form.invalid && this.isImageUploading ) {
      return;
    }
    this.form.disable();
    this.isSaved = true;
    const user: User = this.getCurrentUser();
    if ( this.hasChanges( this.user, user ) ) {
      this.userService.updateUser( user, this.image );
    }
  }

  onDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if ( this.isSaved || !this.hasChanges( this.user, this.getCurrentUser() ) ) {
      return true;
    }
    return this.triggerDiscardChangesDialog().afterClosed().pipe(
      map( ( isConfirmButton: boolean ) => isConfirmButton ), take( 1 )
    );
  }

  ngOnDestroy(): void {
    this.userListenerSub.unsubscribe();
  }
}
