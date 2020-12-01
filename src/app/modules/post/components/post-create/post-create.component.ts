import { map, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Link } from 'src/app/shared/models';
import { PATHS } from 'src/app/shared/constants/globals';
import { Animations } from 'src/app/shared/constants/animations';
import { Post } from 'src/app/shared/models';
import { FormComponent } from 'src/app/shared/components';
import { mimeType } from 'src/app/shared/validators';
import { PostService, LoadingService } from 'src/app/shared/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, UrlTree } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

@Component( {
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: [ './post-create.component.scss' ],
  animations: [ Animations.fadeAnimation ]
} )
export class PostCreateComponent extends FormComponent implements OnInit, OnDestroy {
  postId: string;
  post: Post;
  toolbarLinks: Link[];
  readonly PATHS = PATHS;
  private postListenerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private loadingService: LoadingService,
    dialogService: MatDialog
  ) {
    super( dialogService );
    this.route.paramMap.subscribe( ( paramMap: ParamMap ) => {
      const postId = paramMap.get( 'postId' );
      if ( postId ) {
        this.loadingService.setLoadingListener( true );
        this.postService.getPost( postId );
      }
    } );
  }

  ngOnInit(): void {
    this.form = new FormGroup( {
      title: new FormControl( '', {
        validators: [ Validators.required, Validators.minLength( 3 ) ]
      } ),
      content: new FormControl( '', {
        validators: [ Validators.required ]
      } ),
      image: new FormControl( '', {
        asyncValidators: [ mimeType ]
      } )
    } );

    this.postListenerSub = this.postService.getPostListener()
      .subscribe( ( post: Post ) => {
        if ( !post ) {
          this.showFormError( 'Error' );
          this.form.enable();
          this.isSaved = false;
          return;
        }
        this.post = post;
        this.imagePreview = post.imagePath;
        this.form.patchValue( {
          title: post.title,
          content: post.content,
        } ); // .setValue sets values of all formControls
        this.loadingService.setLoadingListener( false );
      } );
  }

  getCurrentPost(): Post {
    return { ...this.post, ...{
      title: this.form.value.title.trim(),
      content: this.form.value.content.trim(),
      imagePath: this.imagePreview,
    } };
  }

  onSave(): void {
    if ( this.form.invalid && this.isImageUploading ) {
      return;
    }
    this.form.disable();
    this.isSaved = true;
    if ( this.post ) {
      const post: Post = this.getCurrentPost();
      if ( this.hasChanges( this.post, post ) ) {
        this.postService.updatePost( post, this.image );
      } else {
        this.router.navigate( [ PATHS.POSTS.ROOT ] );
      }
    } else {
      const post = new Post( null, this.form.value.title.trim(), this.form.value.content.trim() );
      this.postService.createPost( post, this.image );
    }
  }

  onDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let hasChanges: boolean = this.form.dirty;
    if ( !this.isSaved && this.post ) {
      hasChanges = this.hasChanges( this.post, this.getCurrentPost() );
    }
    if ( this.isSaved || !hasChanges ) {
      return true;
    }
    return this.triggerDiscardChangesDialog().afterClosed().pipe(
      map( ( isConfirmButton: boolean ) => isConfirmButton ), take( 1 )
    );
  }

  onDelete(): void {
    this.postService.deletePost( this.post.id );
  }

  ngOnDestroy(): void {
    this.postListenerSub.unsubscribe();
  }
}
