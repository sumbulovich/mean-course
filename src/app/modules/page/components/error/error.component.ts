import { LoadingService } from 'src/app/shared/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor( private loadingService: LoadingService ) { }

  ngOnInit(): void {
    setTimeout( () => {
      this.loadingService.setLoadingListener( false );
    } );
  }

}
