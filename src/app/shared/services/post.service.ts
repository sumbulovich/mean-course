import { SocketService } from './socket.service';
import { environment } from './../../../environments/environment';
import { Post, Image } from '../../shared/models';
import { PATHS } from '../../shared/constants/globals';
import { PageEvent } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { Subject, Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter, take } from 'rxjs/operators';
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
  private postSocket: SocketService;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  connectPostSocket(): void {
    this.postSocket = new SocketService();
    this.postSocket.initSocket( 'post' );
  }

  disconnectPostSocket(): void {
    this.postSocket.disconnect();
  }

  getPostSocketListener( event: string = 'emitted' ): Observable<any> {
    return this.postSocket.fromEvent( event )
      .pipe( filter( ( socketId: string) => socketId !== this.postSocket.getSocketId() ) );
  }

  emitPostSocket( event: string = 'emit' ): void {
    this.postSocket.emit( event, this.postSocket.getSocketId() );
  }

  getPostsListener(): Observable<Post[]> {
    return this.postsListener.asObservable();
  }

  getPostListener(): Observable<Post> {
    return this.postListener.asObservable();
  }

  getPageData(): PageEvent {
    return this.pageData;
  }

  getPosts( pageData: PageEvent = this.pageData ): void {
    this.pageData = { ...this.pageData, ...pageData };
    const queryParams = `?pagesize=${this.pageData.pageSize}&pageindex=${this.pageData.pageIndex}`;
    this.http
      .get<{ message: string, posts: any, totalPosts: number, pageIndex: number }>( BACKEND_URL + queryParams )
      .pipe( map( responseData => {
        console.log( responseData.message );
        this.pageData = { ...pageData, length: responseData.totalPosts, pageIndex: responseData.pageIndex };
        return responseData.posts.map( ( responseDataPost: any ) => {
          const post: Post = {
            id: responseDataPost._id,
            title: responseDataPost.title,
            content: responseDataPost.content,
            imagePath: responseDataPost.imagePath,
            userId: responseDataPost.userId
          };
          return post;
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
        const post: Post = {
          id: responseData.post._id,
          title: responseData.post.title,
          content: responseData.post.content,
          imagePath: responseData.post.imagePath
        };
        return post;
      } ) )
      .subscribe( ( post: Post ) => {
        this.postListener.next( post );
      }, error => this.router.navigate( [ PATHS.NOT_FOUND ] ) );
  }

  createPost( postData: Post, image?: Image ): void {
    const formData = new FormData(); // FormData object accept values and files
    formData.append( 'title', postData.title );
    formData.append( 'content', postData.content );
    if ( image ) {
      const fileName: string = postData.title.replace( /[^a-zA-Z0-9]/g, '' ).slice( 0, 10 ) + '-' + Date.now();
      formData.append( 'image', image.image, fileName );
      formData.append( 'image', image.thumbnail, fileName );
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
        const post: Post = { title: responseData.post.title ...};
        this.posts.push( post );
        this.postListener.next( post );
        this.postsListener.next( [ ...this.posts ] );
        */ // Not necessary postUpdated because we are navigating to post-list
        this.emitPostSocket();
        this.router.navigate( [ PATHS.POSTS.ROOT ], { state: { pagination: 'last' } } );
      }, error => this.postListener.next( null ) );
  }

  updatePost( postData: Post, image?: Image ): void {
    const formData = new FormData(); // FormData object accept values and files
    formData.append( 'title', postData.title );
    formData.append( 'content', postData.content );
    formData.append( 'imagePath', postData.imagePath );
    if ( image ) {
      const fileName: string = postData.title.replace( /[^a-zA-Z0-9]/g, '' ).slice( 0, 10 ) + '-' + Date.now();
      formData.append( 'image', image.image, fileName );
      formData.append( 'image', image.thumbnail, fileName );
    }
    this.http
      .put<{ message: string, post: any }>( BACKEND_URL + postData.id, formData )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.emitPostSocket();
        this.router.navigate( [ PATHS.POSTS.ROOT ] );
      }, error => this.postsListener.next( null ) ); // We can use PUT or PATCH methods
  }

  deletePost( postId: string, pageData?: PageEvent ): void {
    const postData: Post = this.posts.find( post => post.id === postId );
    this.http
      .delete<{ message: string, post: any }>( BACKEND_URL + '/' + postId )
      .subscribe( responseData => {
        console.log( responseData.message );
        this.pageData.length--;
        const lastPageIndex: number = Math.ceil( this.pageData.length / this.pageData.pageSize ) - 1;
        if ( this.pageData.pageIndex > lastPageIndex && lastPageIndex > 0 ) {
          this.pageData.pageIndex = lastPageIndex;
        }
        this.emitPostSocket();
        if ( pageData ) {
          this.getPosts( pageData );
        } else {
          this.router.navigate( [ PATHS.POSTS.ROOT ] );
        } // If it's deleted from post-list of post-create
      }, error => this.postListener.next( null ) );
  }
}
