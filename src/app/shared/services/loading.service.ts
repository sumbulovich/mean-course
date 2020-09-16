import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingListener = new Subject<boolean>();

  constructor() { }

  getLoadingListener(): Observable<boolean> {
    return this.loadingListener.asObservable();
  }

  setLoadingListener( isLoading: boolean ): void {
    this.loadingListener.next( isLoading );
  }
}
