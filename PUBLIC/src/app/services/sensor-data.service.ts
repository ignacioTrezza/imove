import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  private sensorDataSubject = new BehaviorSubject<any>(null);
  sensorData$ = this.sensorDataSubject.asObservable();

  updateSensorData(data: any) {
    this.sensorDataSubject.next(data);
  }
}