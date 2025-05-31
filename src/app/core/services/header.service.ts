// header.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private headerTitle = new BehaviorSubject<string>('');
  headerTitle$ = this.headerTitle.asObservable();

  setHeaderTitle(title: string): void {
    this.headerTitle.next(title);
  }
}
