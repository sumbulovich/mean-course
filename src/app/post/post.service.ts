import { PATHS, API } from './../constants';
import { PageEvent } from '@angular/material/paginator';
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
  private pageData: PageEvent;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts( pageData: PageEvent = { pageSize: 5, pageIndex: 0, length: 0 } ): void {
    const queryParams = `?pagesize=${pageData.pageSize}&pageindex=${pageData.pageIndex}`;
    this.http
      .get<{ message: string, posts: any, totalPosts: number }>( API.ROOT + API.POSTS + queryParams )
      .pipe( map( responseData => {
        console.log( responseData.message );
        this.pageData = { ...pageData, length: responseData.totalPosts };

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
      .get<{ message: string, post: any }>( API.ROOT + API.POSTS + '/' + id )
      .pipe( map( responseData => {
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
      const fileName: string =  post.title.toLocaleLowerCase().split( ' ' ).join( '-' ) + '-' + Date.now();
      postData.append( 'image', image.image, fileName);
      postData.append( 'image', image.thumbnail, fileName);
    }
    this.http
      .post<{ message: string, post: any }>( API.ROOT + API.POSTS, postData )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.pageData.length++;
        const lastPageIndex = Math.ceil( this.pageData.length / this.pageData.pageSize ) - 1;
        this.pageData.pageIndex = lastPageIndex,
        /*
        const postDb = responseData.post;
        this.posts.push( new Post( postDb._id, postDb.title, postDb.content, postDb.imagePath ) );
        this.postUpdated.next( [ ...this.posts ] );
        */ // Not necessary postUpdated because we are navigating to post-list
        this.router.navigate( [ PATHS.HOME ] );
      } );
  }

  updatePost( post: Post, image?: Image ): void {
    const postData = new FormData(); // FormData object accept values and files
    postData.append( 'id', post.id );
    postData.append( 'title', post.title );
    postData.append( 'content', post.content );
    postData.append( 'imagePath', post.imagePath );
    if ( image ) {
      const fileName: string =  post.title.toLocaleLowerCase().split( ' ' ).join( '-' ) + '-' + Date.now();
      postData.append( 'image', image.image, fileName);
      postData.append( 'image', image.thumbnail, fileName);
    }
    this.http
      .put<{ message: string }>( API.ROOT + API.POSTS + '/' + post.id, postData )
      .subscribe( responseData => {
        console.log( responseData.message );
        /*
        const postIndex: number = this.posts.findIndex( p => p.id === post.id );
        this.posts[ postIndex ] = post;
        this.postUpdated.next( [ ...this.posts ] );
        */ // Not necessary postUpdated because we are navigating to post-list
        this.router.navigate( [ PATHS.HOME ] );
      } ); // We can use PUT or PATCH methods
  }

  deletePost( postId: string, pageData?: PageEvent ): void {
    this.http
      .delete<{ message: string }>( API.ROOT + API.POSTS + '/' + postId )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.pageData.length--;
        const lastPageIndex = Math.ceil( this.pageData.length / this.pageData.pageSize ) - 1
        if ( this.pageData.pageIndex > lastPageIndex ) {
          this.pageData.pageIndex = lastPageIndex;
        }
        /*
        const updatedPosts: Posts[] = this.posts.filter( post => post.id !== postId );
        this.posts = updatedPosts;
        this.postUpdated.next( [ ...this.posts ] );
        */ // Not necessary postUpdated because we are navigating or calling getPost
        if ( pageData ) {
          this.getPosts( pageData );
          return;
        } // If it's deleted from post-list
        this.router.navigate( [ PATHS.HOME ] );
      } );
  }

  getPageData(): PageEvent {
    return this.pageData;
  }
}
