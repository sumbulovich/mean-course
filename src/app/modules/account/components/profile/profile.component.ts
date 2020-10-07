import { PATHS } from 'src/app/shared/constants/globals';
import { FormComponent } from 'src/app/shared/components';
import { Animations } from 'src/app/shared/constants/animations';
import { UserService } from 'src/app/shared/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models';
import { Component, OnInit } from '@angular/core';

enum Mode { read, write }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [ Animations.fadeAnimation ]
})
export class ProfileComponent extends FormComponent implements OnInit {
  user: User;
  modeTypes = Mode;
  mode: Mode;
  PATHS = PATHS;

  constructor( private userService: UserService ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup( {
      firstName: new FormControl( null, {
        validators: [ Validators.required ]
      } ),
      lastName: new FormControl( null, {
        validators: [ Validators.required ]
      } )
    } );

    this.user = this.userService.getUser();
    if ( this.user ) {
      this.imagePreview = this.user.imagePath;
      this.setForm( this.user );
    }

    this.userService.getUserListener().subscribe( ( user: User ) => {
      if ( user ) {
        this.user = user;
        this.imagePreview = this.user.imagePath;
        this.setForm( user );
      } else {
        this.showFormError( 'Error' );
        this.toggleForm( Mode.write );
      }
    } );

    this.toggleForm( Mode.read );
  }

  toggleForm( mode: Mode ): void {
    this.mode = mode;
    mode === Mode.write ? this.form.enable() : this.form.disable();
  }

  onCancel(): void {
    this.setForm( this.user );
    this.toggleForm( Mode.read );
  }

  onSave(): void {
    if ( this.form.invalid && this.isImageUploading ) {
      return;
    }
    const user: User = { ...this.user, ...{
      firstName: this.form.value.firstName.trim(),
      lastName: this.form.value.lastName.trim(),
      imagePath: this.imagePreview,
    } };
    if ( JSON.stringify( this.user ) !== JSON.stringify( user ) || this.image ) {
      this.userService.updateUser( user, this.image );
    } // If there is changes
    this.toggleForm( Mode.read );
  }
}
