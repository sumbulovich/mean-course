import { ImageService } from './../../image/image.service';
import { take, finalize } from 'rxjs/operators';
import { ImageSettings, Image } from '../../image/image.model';
import { mimeType } from '../../image/mime-type.validator';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

enum Mode { create, edit }

@Component( {
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: [ './post-create.component.scss' ],
  animations: [
    trigger( 'fadeAnimation', [
      state( 'in', style( { opacity: 1 } ) ),
      state( 'out', style( { opacity: 0 } ) ),
      transition( 'out => in', animate( 0 ) ),
      transition( 'in => out', animate( 800 ) )
    ] )
  ]
} )
export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  image: Image;
  formErrorMessage: string;
  formHintMessage: string;
  formErrorState = 'out';
  formHintState = 'out';
  modeTypes = Mode;
  mode: Mode;
  isCompressing: boolean;
  @Input() compressedImageSettings = new ImageSettings( 300, 300, 0.05 );
  @Input() thumbnailImageSettings = new ImageSettings( 50, 50 );
  @ViewChild( 'filePicker' ) filePicker: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup( {
      title: new FormControl( null, {
        validators: [ Validators.required, Validators.minLength( 3 ) ]
      } ),
      content: new FormControl( null, {
        validators: [ Validators.required ]
      } ),
      image: new FormControl( null, {
        asyncValidators: [ mimeType ]
      } )
    } );

    this.route.paramMap.subscribe( ( paramMap: ParamMap ) => {
      if ( paramMap.has( 'postId' ) ) {
        this.mode = Mode.edit;
        this.isLoading = true;

        const postId = paramMap.get( 'postId' );
        this.postService.getPost( postId ).subscribe( ( post: Post ) => {
          this.post = post;
          this.form.patchValue( {
            title: post.title,
            content: post.content,
          } ); // .setValue sets values of all formControls
          this.imagePreview = post.imagePath;
          this.isLoading = false;
        } );
      } else {
        this.mode = Mode.create;
      }
    } );
  }

  onImagePicked( event: Event ): void {
    const file: File = ( event.target as HTMLInputElement ).files[ 0 ];
    this.form.patchValue( { image: file } ); // set a value of single formControls
    // this.form.get( 'image' ).updateValueAndValidity(); // inform the value was changed to update and validate

    if ( file ) {
      const reader = new FileReader();
      reader.readAsDataURL( file );
      reader.onload = () => {
        if ( this.form.get( 'image' ).valid ) {
          this.imagePreview = reader.result as string;
          this.compressImage( file );
        } else {
          this.filePicker.nativeElement.value = '';
          this.form.get( 'image' ).reset();
          this.showFormError( 'Invalid Image', 2000 );
        }
      };
    }
  }

  compressImage( file: File ): void {
    const finishCompressing = () => {
      compressingSteps--;
      if ( !compressingSteps ) {
        this.isCompressing = false;
        this.formHintState = 'out';
      }
    };

    let compressingSteps = 2;
    this.isCompressing = true;
    this.showFormHint( 'Compressing...' );

    if ( !this.image ) {
      this.image = new Image();
    }
    this.imageService.compressImage( file, this.compressedImageSettings )
    .pipe(
      take( 1 ), // take only the first value and unsubscribe
      finalize( () => finishCompressing() ) // Execute when the observable completes
    )
    .subscribe(
      ( compresedFile: File ) => {
        this.image.image = compresedFile;
      }, ( error: { compressedFile: Blob, reason: string, error: string } ) => {
        if ( error.error === 'PNG_WITH_ALPHA' ) {
          this.image.image = error.compressedFile;
        } else {
          console.error( error.reason );
        }
      }
    );

    this.imageService.compressImage( file, this.thumbnailImageSettings )
    .pipe(
      take( 1 ), // take only the first value and unsubscribe
      finalize( () => finishCompressing() ) // Execute when the observable completes
    )
    .subscribe(
      ( compresedFile: File ) => {
        this.image.thumbnail = compresedFile;
      }, ( error: { compressedFile: Blob, reason: string, error: string } ) => {
        if ( error.error === 'PNG_WITH_ALPHA' ) {
          this.image.thumbnail = error.compressedFile;
        } else {
          console.error( error.reason );
        }
      }
    );
  }

  showFormError( message: string, msDelay?: number ): void {
    this.formErrorMessage = message;
    this.formErrorState = 'in';
    if ( msDelay ) {
      setTimeout( () => this.formErrorState = 'out', msDelay );
    }
  }

  showFormHint( message: string, msDelay?: number ): void {
    this.formHintMessage = message;
    this.formHintState = 'in';
    if ( msDelay ) {
      setTimeout( () => this.formHintState = 'out', msDelay );
    }
  }

  onSavePost(): void {
    if ( this.form.invalid && this.isCompressing ) {
      return;
    }
    this.isLoading = true;
    if ( this.mode === Mode.create ) {
      this.postService.addPost(
        new Post( null, this.form.value.title, this.form.value.content ),
        this.image
      );
    } else {
      this.postService.updatePost(
        new Post( this.post.id, this.form.value.title, this.form.value.content, this.imagePreview ),
        this.image
      );
    }
    // form.resetForm();
    this.form.reset();
  }

  onDeleteImage(): void {
    this.image = null;
    this.imagePreview = '';
    this.filePicker.nativeElement.value = '';
    this.form.get( 'image' ).reset();
  }

  onDelete(): void {
    this.postService.deletePost( this.post.id );
  }
}
