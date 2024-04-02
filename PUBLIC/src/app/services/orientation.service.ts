import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrientationService {
  constructor() { }

  getOrientationStream(): Observable<Event> {
    return fromEvent(window, 'deviceorientation');
  }
}