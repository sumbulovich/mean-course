import { environment } from './../../../environments/environment';
import { Post, Image } from '../../shared/models';
import { PATHS } from '../../shared/constants/globals';
import { PageEvent } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable( {
  providedIn: 'root'
} )
export class PostService {
  private posts: Post[] = [];
  private postsListener = new Subject<Post[]>();
  private postListener = new Subject<Post>();
  private pageData: PageEvent = { pageSize: 5, pageIndex: 0, length: 0 };
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPostsListener(): Observable<Post[]> {
    return this.postsListener.asObservable();
  }

  getPostListener(): Observable<Post> {
    return this.postListener.asObservable();
  }

  getPageData(): PageEvent {
    return this.pageData;
  }

  getPosts( pageData: PageEvent ): void {
    this.pageData = { ...this.pageData, ...pageData };
    const queryParams = `?pagesize=${this.pageData.pageSize}&pageindex=${this.pageData.pageIndex}`;
    this.http
      .get<{ message: string, posts: any, totalPosts: number, pageIndex: number }>( BACKEND_URL + queryParams )
      .pipe( map( responseData => {
        console.log( responseData.message );
        this.pageData = { ...pageData, length: responseData.totalPosts, pageIndex: responseData.pageIndex };
        return responseData.posts.map( ( postDb: any ) => {
          return new Post( postDb._id, postDb.title, postDb.content, postDb.imagePath, postDb.creator );
        } );  // Convert DB content to Post model
      } ) )
      .subscribe( ( posts: Post[] ) => {
        this.posts = posts;
        this.postsListener.next( [ ...this.posts ] );
      } );
  }

  getPost( id: string ): void {
    // return { ...this.posts.find( p => p.id === id ) };
    this.http
      .get<{ message: string, post: any }>( BACKEND_URL + id )
      .pipe( map( responseData => {
        console.log( responseData.message );
        const postDb = responseData.post;
        return new Post( postDb._id, postDb.title, postDb.content, postDb.imagePath );
      } ) )
      .subscribe( ( post: Post ) => {
        this.postListener.next( post );
      }, error => this.router.navigate( [ PATHS.NOT_FOUND ] ) );
  }

  addPost( post: Post, image?: Image ): void {
    const formData = new FormData(); // FormData object accept values and files
    formData.append( 'title', post.title );
    formData.append( 'content', post.content );
    if ( image ) {
      console.log();
      const fileName: string = post.title.replace( /[^a-zA-Z0-9]/g, '' ).slice( 0, 10 ) + '-' + Date.now();
      formData.append( 'image', image.image, fileName);
      formData.append( 'image', image.thumbnail, fileName);
    }
    this.http
      .post<{ message: string, post: any }>( BACKEND_URL, formData )
      .subscribe( responseData => {
        console.log( responseData.message );
        /*
        this.pageData.length++;
        const lastPageIndex = Math.ceil( this.pageData.length / this.pageData.pageSize ) - 1;
        this.pageData.pageIndex = lastPageIndex;
        */ // Not necessary update pageData because state.pagination
        /*
        const postDb = responseData.post;
        const post = new Post( postDb._id, postDb.title, postDb.content, postDb.imagePath );
        this.posts.push( post );
        this.postListener.next( post );
        this.postsListener.next( [ ...this.posts ] );
        */ // Not necessary postUpdated because we are navigating to post-list
        this.router.navigate( [ PATHS.POSTS.ROOT ], { state: { pagination: 'last' } } );
      }, error => this.postListener.next( null ) );
  }

  updatePost( post: Post, image?: Image ): void {
    const formData = new FormData(); // FormData object accept values and files
    formData.append( 'id', post.id );
    formData.append( 'title', post.title );
    formData.append( 'content', post.content );
    formData.append( 'imagePath', post.imagePath );
    if ( image ) {
      const fileName: string = post.title.replace( /[^a-zA-Z0-9]/g, '' ).slice( 0, 10 ) + '-' + Date.now();
      formData.append( 'image', image.image, fileName);
      formData.append( 'image', image.thumbnail, fileName);
    }
    this.http
      .put<{ message: string }>( BACKEND_URL  + post.id, formData )
      .subscribe( responseData => {
        console.log( responseData.message );
        /*
        const postDb = responseData.post;
        const post = new Post( postDb._id, postDb.title, postDb.content, postDb.imagePath );
        this.posts.push( post );
        this.postListener.next( post );
        this.postsListener.next( [ ...this.posts ] );
        */ // Not necessary postUpdated because we are navigating to post-list
        this.router.navigate( [ PATHS.POSTS.ROOT ] );
      }, error => this.postsListener.next( null ) ); // We can use PUT or PATCH methods
  }

  deletePost( postId: string, pageData?: PageEvent ): void {
    this.http
      .delete<{ message: string }>( BACKEND_URL + '/' + postId )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.pageData.length--;
        const lastPageIndex = Math.ceil( this.pageData.length / this.pageData.pageSize ) - 1;
        if ( this.pageData.pageIndex > lastPageIndex ) {
          this.pageData.pageIndex = lastPageIndex;
        }
        /*
        const postIndex: number = this.posts.findIndex( p => p.id !== postId );
        const post = this.posts.splice( postIndex, 1 );
        this.postUpdated.next( [ ...this.posts ] );
        this.postListener.next( post );
        */ // Not necessary postUpdated because we are navigating or calling getPost
        if ( pageData ) {
          this.getPosts( pageData );
          return;
        } // If it's deleted from post-list
        this.router.navigate( [ PATHS.POSTS.ROOT ] );
      }, error => this.postListener.next( null ) );
  }
}
