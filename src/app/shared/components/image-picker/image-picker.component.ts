import { Ng2ImgMaxService } from 'ng2-img-max';
import { take, finalize, flatMap } from 'rxjs/operators';
import { Observable, iif } from 'rxjs';
import { mimeType } from './../../validators/mime-type.validator';
import { FormControl, FormGroup } from '@angular/forms';
import { Image, ImageSettings } from './../../models/image.model';
import { Component, EventEmitter, OnInit, Output, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  isCompressing: boolean;
  image: Image;
  form: FormGroup;
  isDomReady: boolean;
  @Input() imagePreview: string;
  @Input() isEditable = true;
  @Input() class = 'border border-bottom-0 h-100';
  @Input() placeholderClass = 'text-muted';
  @Input() buttonClass = 'rounded-0';
  @Input() placeholderIcon = 'add_photo_alternate';
  @Input() compressedImageSettings = new ImageSettings( 300, 300, 0.05 );
  @Input() thumbnailImageSettings = new ImageSettings( 50, 50 );
  @Output() imageChange = new EventEmitter<Image>();
  @Output() imageError = new EventEmitter<boolean>();
  @ViewChild( 'filePicker' ) filePicker: ElementRef;

  constructor( private ng2ImgMaxService: Ng2ImgMaxService ) { }

  ngOnInit(): void {
    this.form = new FormGroup( {
      image: new FormControl( '', {
        asyncValidators: [ mimeType ]
      } )
    } );

    setTimeout( () => {
      this.isDomReady = true;
    } );
  }

  onImagePicked( event: Event ): void {
    const file: File = ( event.target as HTMLInputElement ).files[ 0 ];
    this.form.patchValue( { image: file } ); // set a value of single formControls

    if ( file ) {
      const reader = new FileReader();
      reader.readAsDataURL( file );
      reader.onload = () => {
        if ( this.form.get( 'image' ).valid ) {
          this.imagePreview = reader.result as string;
          this.imageError.emit( false );
          this.compressImages( file );
        } else {
          this.filePicker.nativeElement.value = '';
          this.form.get( 'image' ).reset();
          this.imageError.emit( true );
        }
      };
    }
  }

  compressImages( file: File ): void {
    let compressingSteps = 2;
    const finishCompressing = () => {
      compressingSteps--;
      if ( !compressingSteps ) {
        this.imageChange.emit( this.image );
        this.isCompressing = false;
      }
    };

    if ( !this.image ) {
      this.image = { image: null, thumbnail: null };
    }
    this.isCompressing = true;
    this.compressImage( file, this.compressedImageSettings )
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
        this.imageError.emit( true );
      }
    );

    this.compressImage( file, this.thumbnailImageSettings )
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
        this.imageError.emit( true );
      }
    );
  }

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

  onDeleteImage(): void {
    this.image = null;
    this.imagePreview = '';
    this.filePicker.nativeElement.value = '';
    this.form.get( 'image' ).reset();
    this.imageChange.emit( this.image );
  }
}
