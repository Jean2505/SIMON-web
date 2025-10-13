import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';

export interface SaveLocationPayload {
  lat: number;
  lng: number;
  source?: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly endpoint = '/api/save-location';
  constructor(private readonly http: HttpClient) { }

  saveLocation(payload: SaveLocationPayload): Observable<void> {
    // return this.http.post<void>(this.endpoint, payload);
    console.log('[LocationService] payload ->', payload);
    return of(void 0).pipe(delay(600));
  }
}
