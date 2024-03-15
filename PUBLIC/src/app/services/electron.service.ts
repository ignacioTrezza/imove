import { Injectable } from '@angular/core';
interface ElectronAPI {
  moveCursorTo(x: number, y: number): void;
  clickIn(x: number, y: number): void;
  getLocalIpAddress(): string;
  qrWifi(): void;
  qrMagic(): void;
}
@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  get isElectron(): boolean {
    return typeof window !== 'undefined' && (window as any).electronAPI !== undefined;
  }

  get electronAPI(): ElectronAPI {
    console.log('electronAPI', (window as any).electronAPI);
    return (window as any).electronAPI;
  }

  constructor() { }
}