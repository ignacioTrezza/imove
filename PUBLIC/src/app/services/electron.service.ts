import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

interface ElectronAPI {
  moveCursorTo(x: number, y: number): void;
  clickIn(x: number, y: number): void;
  getLocalIpAddress(): Promise<string>;
  qrWifi(): void;
  qrMagic(data: string): Promise<string>;
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  get isElectron(): boolean {
    return typeof window !== 'undefined' && (window as any).electronAPI !== undefined;
  }

  get electronAPI(): ElectronAPI {
    return (window as any).electronAPI;
  }


  constructor() { }
}