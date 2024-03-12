import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket | undefined;
  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable();
  public accelerometerData = new EventEmitter<{ x: number; y: number; z: number }>();
  public gyroscopeData = new EventEmitter<{ alpha: number; beta: number; gamma: number }>();
  public Click = new EventEmitter<{ x: number; y: number }>();
  constructor() { }

  connect(ipAddress: string): void {
    this.ws = new WebSocket(`wss://${ipAddress}`);
    this.ws.onopen = () => console.log('WebSocket Client Connected');
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messagesSubject.next(data);
    };
    this.ws.onerror = (error) => console.error('WebSocket error:', error);
    this.ws.onclose = () => console.log('WebSocket connection closed');
  }

  sendMessage(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open.');
    }
  }

  emitAccelerometerData(x: number, y: number, z: number): void {
    this.accelerometerData.emit({ x, y, z });
  }

  emitGyroscopeData(alpha: number, beta: number, gamma: number): void {
    this.gyroscopeData.emit({ alpha, beta, gamma });
  }

  emitClick(x: number, y: number): void {
    this.Click.emit({ x, y });
  }
}

