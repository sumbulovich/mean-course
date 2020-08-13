import { Image } from '../image/image.model';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable( {
  providedIn: 'root'
} )
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts(): void {
    // return [ ...this.posts ];
    this.http
      .get<{ message: string, posts: any }>( 'http://localhost:3000/api/posts' )
      .pipe( map( ( responseData ) => {
        return responseData.posts.map( ( postDb: any ) => {
          if ( postDb.imagePath ) {
            postDb.imagePath = postDb.imagePath.replace('posts/', 'posts/thumbnails/');
          }
          return new Post( postDb._id, postDb.title, postDb.content, postDb.imagePath );
        } );  // Convert DB content to Post model
      } ) )
      .subscribe( ( posts: Post[] ) => {
        this.posts = posts;
        this.postUpdated.next( [ ...this.posts ] );
      } );
  }

  getPost( id: string ): Observable<Post> {
    // return { ...this.posts.find( p => p.id === id ) };
    return this.http
      .get<{ message: string, post: any }>( 'http://localhost:3000/api/posts/' + id )
      .pipe( map( ( responseData ) => {
        console.log( responseData.message );
        const postDb = responseData.post;
        return new Post( postDb._id, postDb.title, postDb.content, postDb.imagePath );
      } ) );
  }

  getPostUpdatedListener(): Observable<Post[]> {
    return this.postUpdated.asObservable();
  }

  addPost( post: Post, image?: Image ): void {
    const postData = new FormData(); // FormData object accept values and files
    postData.append( 'title', post.title );
    postData.append( 'content', post.content );
    if ( image ) {
      const fileName =  post.title.toLocaleLowerCase().split( ' ' ).join( '-' ) + '-' + Date.now();
      postData.append( 'image', image.image, fileName);
      postData.append( 'image', image.thumbnail, fileName);
    }
    this.http
      .post<{ message: string, post: any }>( 'http://localhost:3000/api/posts', postData )
      .subscribe( ( responseData ) => {
        console.log( responseData.message );
        const postDb = responseData.post;
        this.posts.push( new Post( postDb._id, postDb.title, postDb.content, postDb.imagePath ) );
        this.postUpdated.next( [ ...this.posts ] );
        this.router.navigate( [ '/' ] );
      } );
  }

  updatePost( post: Post, image?: Image ): void {
    const postData = new FormData(); // FormData object accept values and files
    postData.append( 'id', post.id );
    postData.append( 'title', post.title );
    postData.append( 'content', post.content );
    postData.append( 'imagePath', post.imagePath );
    if ( image ) {
      const fileName =  post.title.toLocaleLowerCase().split( ' ' ).join( '-' ) + '-' + Date.now();
      postData.append( 'image', image.image, fileName);
      postData.append( 'image', image.thumbnail, fileName);
    }
    this.http
      .put<{ message: string }>( 'http://localhost:3000/api/posts/' + post.id, postData )
      .subscribe( ( responseData ) => {
        console.log( responseData.message );
        const postIndex = this.posts.findIndex( p => p.id === post.id );
        this.posts[ postIndex ] = post;
        this.postUpdated.next( [ ...this.posts ] );
        this.router.navigate( [ '/' ] );
      } ); // We can use PUT or PATCH methods
  }

  deletePost( postId: string ): void {
    this.http
      .delete<{ message: string }>( 'http://localhost:3000/api/posts/' + postId )
      .subscribe( ( responseData ) => {
        console.log( responseData.message );
        const updatedPosts = this.posts.filter( post => post.id !== postId );
        this.posts = updatedPosts;
        this.postUpdated.next( [ ...this.posts ] );
        if ( this.router.url !== '/' ) {
          this.router.navigate( [ '/' ] );
        }
      } );
  }
}
