import { Link } from './../../../../shared/models/link.model';
import { PATHS } from 'src/app/shared/constants/globals';
import { Animations } from 'src/app/shared/constants/animations';
import { Post } from 'src/app/shared/models';
import { FormComponent } from 'src/app/shared/components';
import { mimeType } from 'src/app/shared/validators';
import { PostService, LoadingService } from 'src/app/shared/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';

enum Mode { create, edit }

@Component( {
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: [ './post-create.component.scss' ],
  animations: [ Animations.fadeAnimation ]
} )
export class PostCreateComponent extends FormComponent implements OnInit, OnDestroy {
  postId: string;
  post: Post;
  modeTypes = Mode;
  mode: Mode;
  toolbarLinks: Link[];
  readonly PATHS = PATHS;
  private postListenerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private loadingService: LoadingService,
  ) {
    super();
    this.route.paramMap.subscribe( ( paramMap: ParamMap ) => {
      this.postId = paramMap.get( 'postId' );
      if ( this.postId ) {
        this.loadingService.setLoadingListener( true );
      }
    } );
  }

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

    this.mode = this.postId ? Mode.edit : Mode.create;
    if ( this.mode === Mode.edit ) {
      this.postService.getPost( this.postId )
        .subscribe( ( post: Post ) => {
          this.post = post;
          this.imagePreview = post.imagePath;
          this.form.patchValue( {
            title: post.title,
            content: post.content,
          } ); // .setValue sets values of all formControls
          this.loadingService.setLoadingListener( false );
        } );
    }

    this.postListenerSub = this.postService.getPostListener()
      .subscribe( ( post: Post ) => {
        if ( !post ) {
          this.showFormError( 'Error' );
        }
        this.form.enable();
      } );
  }

  onSave(): void {
    if ( this.form.invalid && this.isImageUploading ) {
      return;
    }
    if ( this.mode === Mode.edit ) {
      const post: Post = { ...this.post, ...{
        title: this.form.value.title.trim(),
        content: this.form.value.content.trim(),
        imagePath: this.imagePreview,
      } };
      if ( JSON.stringify( this.post ) !== JSON.stringify( post ) || this.image ) {
        this.postService.updatePost( post, this.image );
        this.form.disable();
      }  else {
        this.router.navigate( [ PATHS.POSTS.ROOT ] );
      } // If there is changes
    } else {
      const post = new Post( null, this.form.value.title.trim(), this.form.value.content.trim() );
      this.postService.addPost( post, this.image );
    }
  }

  onDelete(): void {
    this.postService.deletePost( this.post.id );
  }

  ngOnDestroy(): void {
    this.postListenerSub.unsubscribe();
  }
}
