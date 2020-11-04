export class ImageSettings {
  maxWidth = 1000;
  maxHeight = 1000;
  maxSizeInMB: number;

  constructor( maxWidth: number, maxHeight: number, maxSizeInMB?: number ) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.maxSizeInMB = maxSizeInMB;
  }
}

export interface Image {
  image: Blob;
  thumbnail: Blob;
}
