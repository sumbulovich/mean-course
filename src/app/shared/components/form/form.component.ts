import { map } from 'rxjs/operators';
import { DialogData } from './../../models/dialog.model';
import { DialogComponent } from './../dialog/dialog.component';
import { Observable } from 'rxjs';
import { UrlTree } from '@angular/router';
import { OnDeactivate } from './../../constants/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AnimationState } from 'src/app/shared/constants/globals';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Image } from '../../models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnDeactivate {
  form: FormGroup;
  isImageUploading: boolean;
  formErrorMessage: string;
  formHintMessage: string;
  formErrorState = AnimationState.out;
  formHintState = AnimationState.out;
  image: Image;
  imagePreview: string;
  isSaved: boolean;

  constructor( private dialogService: MatDialog ) { }

  showFormError( message: string, msDelay?: number ): void {
    this.formErrorMessage = message;
    this.formErrorState = AnimationState.in;
    if ( msDelay ) {
      setTimeout( () => this.formErrorState = AnimationState.out, msDelay );
    }
  }

  showFormHint( message: string, msDelay?: number ): void {
    this.formHintMessage = message;
    this.formHintState = AnimationState.in;
    if ( msDelay ) {
      setTimeout( () => this.formHintState = AnimationState.out, msDelay );
    }
  }

  onImageChange( image: Image ): void {
    this.isImageUploading = false;
    this.image = image;
    if ( !image ) {
      this.imagePreview = '';
    }
  }

  onImageError( error: boolean ): void {
    this.isImageUploading = !error;
    if ( error ) {
      this.showFormError( 'Invalid Image', 2000 );
    }
  }

  setForm( element: any ): void {
    Object.keys( this.form.controls ).forEach( ( key: string ) => {
      this.form.controls[ key ].setValue( element[ key ] );
    } );
  }

  hasChanges( element1: any, element2: any ): boolean {
    return JSON.stringify( element1 ) !== JSON.stringify( element2 ) || !!this.image;
  }

  onSave(): void {
  }

  onDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  triggerDiscardChangesDialog(): MatDialogRef<DialogComponent> {
    const dialogRef = this.dialogService.open( DialogComponent, {
      data: {
        title: 'Discard Changes',
        content: 'You have unsaved changes. Are you sure you want to leave this page?',
        cancelButton: { text: 'Cancel' },
        confirmButton: { text: 'Discard', color: 'primary' }
      } as DialogData,
      disableClose: true // Whether the user can use escape or clicking on the backdrop to close the dialog.
    } );
    return dialogRef;
  }
}
