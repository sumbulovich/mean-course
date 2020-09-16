import { Observable, Observer, of } from 'rxjs';
import { AbstractControl } from '@angular/forms';

export const mimeType = ( control: AbstractControl ): Promise<{ [ key: string ]: any }> | Observable<{ [ key: string ]: any }> => {
  if ( !control.value ) {
    return of( null ); // Of creates an Observable
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObs = Observable.create( ( observer: Observer<{ [ key: string ]: any }> ) => {
    fileReader.addEventListener( 'loadend', () => {
      const arr = new Uint8Array( fileReader.result as ArrayBuffer ).subarray( 0, 4 );
      let header = '';
      let isValid = false;
      /* for ( let i = 0; i < arr.length; i++ ) {
        header += arr[ i ].toString( 16 );
      } */
      /* arr.forEach( ( el: number ) => {
        header += el.toString( 16 );
      } ); */
      for ( const el of arr ) {
        header += el.toString( 16 );
      }
      switch ( header ) { // File types
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      isValid ? observer.next( null ) : observer.next( { invalidMimeType: true } );
      observer.complete();
    } ); // equivalend to fileReader.onloadend()
    fileReader.readAsArrayBuffer( file );
  } );
  return fileReaderObs;
}; // Async validator
