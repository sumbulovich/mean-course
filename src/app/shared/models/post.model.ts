export class Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  userId: string;

  constructor( id: string, title: string, content: string, imagePath?: string, userId?: string ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.imagePath = imagePath;
    this.userId = userId;
  }
}

/*
export interface Post {
  id: string;
  title: string;
  content: string;
}
*/
