import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {
  private socketId: string;

  constructor(
    socketIoConfig: SocketIoConfig = { url: environment.socketUrl, options: {} }
  ) {
    super( socketIoConfig );
   }

  getSocketId(): string {
     return this.socketId;
  }

  initSocket( room?: string ): void {
    this.on( 'connect', () => {
      // console.log('Socket connected');
    } );
    this.on( 'disconnect', () => {
      console.log('Socket disconnected');
    } );
    // Default events

    this.on( 'connected', ( socketId: string ) => {
      console.log( `Socket "${socketId}" connected` );
      this.socketId = socketId;
      if ( room ) {
        this.emit( 'join', room );
      }
    } );
    this.on( 'joined', ( socketId: string ) => {
      console.log(`Socket "${socketId}" joined on "${room}" room` );
    } );
    // Custom events
  }
}
