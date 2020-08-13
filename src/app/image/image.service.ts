import { Ng2ImgMaxService } from 'ng2-img-max';
import { take, flatMap } from 'rxjs/operators';
import { Observable, iif } from 'rxjs';
import { Injectable } from '@angular/core';
import { ImageSettings } from './image.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor( private ng2ImgMaxService: Ng2ImgMaxService ) { }

  compressImage( file: File, imageSettings: ImageSettings ): Observable<File> {
    return this.ng2ImgMaxService.resizeImage( file, imageSettings.maxWidth, imageSettings.maxHeight ).pipe(
      take( 1 ), // Take the first emission and unsubscribe
      flatMap( ( resizedFile: File ) =>
        iif( () => !!imageSettings.maxSizeInMB,
          this.ng2ImgMaxService.compressImage( resizedFile, imageSettings.maxSizeInMB, false ),
          new Observable<File>( ( subscriber ) => subscriber.next( resizedFile ) )
        ) // iif RxJS method return a observable based on a condition
      ) // flatMap RxJS method merge the result of previus observable with the next one
    );
  }
}
