import { AnimationState } from 'src/app/shared/constants/globals';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Image } from '../../models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  isImageUploading: boolean;
  formErrorMessage: string;
  formHintMessage: string;
  formErrorState = AnimationState.out;
  formHintState = AnimationState.out;
  image: Image;
  imagePreview: string;

  constructor() { }

  ngOnInit(): void {
  }

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

  onSave(): void {
  }
}
