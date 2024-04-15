import { Injectable } from '@angular/core';
import { Observable, Subject, throttle, timer } from 'rxjs';
import { signal } from '@angular/core'; // Import signal
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/app.state';
import * as AppActions from '../core/store/actions/app.actions';
import * as WebSocketActions from '../core/store/actions/web-socket.actions';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket | undefined;
  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable().pipe(
    throttle(() => timer(100)) // Throttle the data to emit once every 100ms;
  );

  // Refactor to use signals
  private gyroscopeDataSubject = new Subject<{ alpha: number; beta: number; gamma: number }>();
  public gyroscopeData$ = this.gyroscopeDataSubject.asObservable();

  private accelerometerDataSubject = new Subject<{ x: number; y: number; z: number }>();
  public accelerometerData$ = this.accelerometerDataSubject.asObservable();
  
  private accelerometerIncludingGravityDataSubject = new Subject<{ x: number; y: number; z: number }>();
  public accelerometerIncludingGravityData$ = this.accelerometerIncludingGravityDataSubject.asObservable();

  private clickDataSubject = new Subject<{ x: number; y: number }>();
  public clickData$ = this.clickDataSubject.asObservable();


  private processedPointerDataSubject = new Subject<{ x: number; y: number; z: number }>();
  public processedPointerData$ = this.processedPointerDataSubject.asObservable();

  public gyroscopeDataSignal = signal<{ alpha: number; beta: number; gamma: number }>({ alpha: 0, beta: 0, gamma: 0 });
  public accelerometerDataSignal = signal<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  public clickSignal = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  public accelerometerIncludingGravityDataSignal = signal<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  public processedPointerDataSignal = signal<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  constructor(private store: Store<AppState>) { }

  connect(ipAddress: string): void {
    console.log('Connecting to WebSocket...', ipAddress);
    this.ws = new WebSocket(`wss://${ipAddress}`);
    this.ws.onopen = () => this.store.dispatch(WebSocketActions.webSocketConnected());
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messagesSubject.next(data);
      if (data.type === 'gyroscope') {
        this.gyroscopeDataSignal.set({ alpha: data.alpha, beta: data.beta, gamma: data.gamma });
        this.gyroscopeDataSubject.next({ alpha: data.alpha, beta: data.beta, gamma: data.gamma });
      }
      if (data.type === 'accelerometer') {
        this.accelerometerDataSignal.set({ x: data.x, y: data.y, z: data.z });
        this.accelerometerDataSubject.next({ x: data.x, y: data.y, z: data.z });
      }
      if (data.type === 'click') {
        this.clickSignal.set({ x: data.x, y: data.y });
        this.clickDataSubject.next({ x: data.x, y: data.y });
      }
      if (data.type === 'accelerometerIncludingGravity') {
        this.accelerometerIncludingGravityDataSignal.set({ x: data.x, y: data.y, z: data.z });
        this.accelerometerIncludingGravityDataSubject.next({ x: data.x, y: data.y, z: data.z });
      }
    };
    this.ws.onerror = (error) => console.error('WebSocket error:', error);
    this.ws.onclose = () => this.store.dispatch(WebSocketActions.webSocketDisconnected());
  }
disconnect(){
  this.ws?.close();
}
  //Envío de Mensaje por webSocket (al BE)
  sendMessage(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open.');
    }
  }

//envia por webSocket (al BE) cada evento por separado
  sendGyroscopeData(alpha: number, beta: number, gamma: number): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'gyroscope', alpha, beta, gamma }));
    } else {
      console.error('WebSocket is not open.');
    }
  }

  sendAccelerometerData(x: number, y: number, z: number): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'accelerometer', x, y, z }));
    } else {
      console.error('WebSocket is not open.');
    }
  }

  sendClickData(x: number, y: number): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'click', x, y }));
    } else {
      console.error('WebSocket is not open.');
    }
  }

  sendAccelerometerIncludingGravityData(x: number, y: number, z: number): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'accelerometerIncludingGravity', x, y, z }));
    } else {
      console.error('WebSocket is not open.');
    }
  }
  sendProcessedPointerData(x: number, y: number, z: number): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'processedPointerData', x, y, z }));
    } else {
      console.error('WebSocket is not open.');
    }
  }
  sendPointerData(x: number, y: number, z: number): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'pointerData', x, y, z }));
    } else {
      console.error('WebSocket is not open.');
    }
  }
}
