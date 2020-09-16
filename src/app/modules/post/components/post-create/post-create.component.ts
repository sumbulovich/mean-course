import { mimeType } from './../../../../shared/validators';
import { ImageService, PostService, LoadingService } from './../../../../shared/services';
import { Image, ImageSettings, Post } from './../../../../shared/models';
import { take, finalize } from 'rxjs/operators';
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PATHS } from 'src/app/shared/constants/constants';
import { Subscription } from 'rxjs';

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
export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post;
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
  private postListenerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private imageService: ImageService,
    private loadingService: LoadingService
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
      if ( !paramMap.has( 'postId' ) ) {
        this.mode = Mode.create;
        setTimeout( () => this.loadingService.setLoadingListener( false ) );
        return;
      }
      this.mode = Mode.edit;
      const postId: string = paramMap.get( 'postId' );
      this.postService.getPost( postId ).subscribe( ( post: Post ) => {
        this.post = post;
        this.form.patchValue( {
          title: post.title,
          content: post.content,
        } ); // .setValue sets values of all formControls
        this.imagePreview = post.imagePath;
        this.loadingService.setLoadingListener( false );
      } );
    } );

    this.postListenerSub = this.postService.getPostListener()
      .subscribe( () => this.form.enable() );
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
      take( 1 ), // Take the first emission and unsubscribe
      finalize( () => finishCompressing() ) // Execute when the observable completes
    )
    .subscribe(
      ( compressedFile: File ) => {
        this.image.image = compressedFile;
      }, ( error: { compressedFile: Blob, reason: string, error: string } ) => {
        if ( error.error === 'PNG_WITH_ALPHA' ) {
          this.image.image = error.compressedFile;
          return;
        }
        console.error( error.reason );
      }
    );

    this.imageService.compressImage( file, this.thumbnailImageSettings )
    .pipe(
      take( 1 ), // Take the first emission and unsubscribe
      finalize( () => finishCompressing() ) // Execute when the observable completes
    )
    .subscribe(
      ( compressedFile: File ) => {
        this.image.thumbnail = compressedFile;
      }, ( error: { compressedFile: Blob, reason: string, error: string } ) => {
        if ( error.error === 'PNG_WITH_ALPHA' ) {
          this.image.thumbnail = error.compressedFile;
          return;
        }
        console.error( error.reason );
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
    if ( this.mode === Mode.create ) {
      const post = new Post( null, this.form.value.title.trim(), this.form.value.content.trim() );
      this.postService.addPost( post, this.image );
    } else {
      const post = new Post( this.post.id, this.form.value.title.trim(), this.form.value.content.trim(), this.imagePreview );
      if ( JSON.stringify( this.post ) === JSON.stringify( post ) ) {
        this.router.navigate( [ PATHS.HOME ] );
        return;
      } // If there is not changes
      this.postService.updatePost( post, this.image );
    }
    this.form.disable();
    // this.form.reset();
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

  ngOnDestroy(): void {
    this.postListenerSub.unsubscribe();
  }
}
