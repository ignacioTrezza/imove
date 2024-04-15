import { Injectable } from '@angular/core';
import { Observable, Subject, debounceTime, throttle, timer } from 'rxjs';
import { signal } from '@angular/core'; // Import signal

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket | undefined;
  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable().pipe(
    debounceTime(100)
  );

  private handlers: { [key: string]: (data: any) => void };

  accelerometerData = signal<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  gyroscopeData = signal<{ alpha: number; beta: number; gamma: number }>({ alpha: 0, beta: 0, gamma: 0 });
  click = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  accelerometerIncludingGravityData = signal<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  processedPointerData = signal<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  constructor() {
    this.handlers = {
      'accelerometer': this.updateAccelerometerData,
      'gyroscope': this.updateGyroscopeData,
      'click': this.updateClickData,
      'accelerometerIncludingGravity': this.updateAccelerometerIncludingGravityData,
      'processedPointer': this.updateProcessedPointerData
    };
    this.setupDataListeners();
  }

  private setupDataListeners() {
    this.ws?.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.handleData(data.type, data.payload);
    });
  }

  private handleData(type: string, payload: any) {
    const handler = this.handlers[type];
    if (handler) {
      handler.call(this, payload);
    }
  }

  public updateAccelerometerData = (data: { x: number; y: number; z: number }) => {
    this.accelerometerData.set(data);
  }

  public updateGyroscopeData = (data: { alpha: number; beta: number; gamma: number }) => {
    this.gyroscopeData.set(data);
  }

  public updateClickData = (data: { x: number; y: number }) => {
    this.click.set(data);
  }

  public updateAccelerometerIncludingGravityData = (data: { x: number; y: number; z: number }) => {
    this.accelerometerIncludingGravityData.set(data);
  }

  public updateProcessedPointerData = (data: { x: number; y: number; z: number }) => {
    this.processedPointerData.set(data);
  }

  // Additional methods to update other signals similarly
}
export interface UserState {
  id: number;
  username: string;
  email?: string;
  origin: any;
  ownFeatures: [{eventName: "", enviaOn: false, recibeOn: false}]
  availableFeatures: [{eventName: "", enviaOn: false, recibeOn: false}]
}
export interface SensorState {
  Click: { x: number; y: number };
  processedPointerData: { x: number; y: number; z: number };
  accelerometerData: { x: number; y: number; z: number };
  gyroscopeData: { alpha: number; beta: number; gamma: number };
  accelerometerIncludingGravityData: { x: number; y: number; z: number };
}
export interface CanvasState {
  objects: any[]; // Define more specific type if possible
}

export interface WebSocketState {
  isConnected: boolean;
  data: any; // Define more specific type if possible
}

export interface AppState {
  canvas: CanvasState;
  user: UserState;
  websocket: WebSocketState;
}
