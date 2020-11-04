import { LoadingService } from './../../../../shared/services/loading.service';
import { PATHS } from 'src/app/shared/constants/globals';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  readonly PATHS = PATHS;

  constructor() { }

  ngOnInit(): void {
  }
}
