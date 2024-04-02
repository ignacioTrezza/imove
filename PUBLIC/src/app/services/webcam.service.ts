import { Injectable } from '@angular/core';
import { Observable, animationFrameScheduler, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebcamService {
  constructor() { }

  getWebcamStream(videoElement: HTMLVideoElement): Observable<ImageData> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    return interval(0, animationFrameScheduler).pipe(
      map(() => {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        return context.getImageData(0, 0, canvas.width, canvas.height);
      })
    );
  }
}