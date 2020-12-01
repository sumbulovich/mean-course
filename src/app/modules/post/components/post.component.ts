import { PostService } from 'src/app/shared/services';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    this.postService.connectPostSocket();
  }

  ngOnDestroy(): void {
    this.postService.disconnectPostSocket();
  }
}
