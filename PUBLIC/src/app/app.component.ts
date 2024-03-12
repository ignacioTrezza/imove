import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { WebsocketService } from './services/web-socket.service';
import { ElectronService } from './services/electron.service';

import { AnotherSubscriberComponent } from './componentes/another-subscriber/another-subscriber.component';
import { SensorMessage } from './core/interfaces/sensor.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [AnotherSubscriberComponent]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Imove';

  constructor(
    private websocketService: WebsocketService,
    private electronService: ElectronService) {
      if (this.electronService.isElectron) {
        // Use Electron APIs, e.g., this.electronService.electronAPI.moveCursorTo(...)
        console.log('electronServiceAPI',this.electronService.isElectron )
        this.electronService.electronAPI.moveCursorTo(10, 10);
      }
    }

  ngOnInit(): void {
    this.initializeWebSocketConnection();
    this.addDeviceEventListeners();
    console.log('electronServiceAPIaa',this.electronService.isElectron )
    if(this.electronService.isElectron){
      this.electronService.electronAPI.moveCursorTo(10, 10); // Assuming default values for x and y as 'data' is not defined
      console.log('electronServiceAPI',this.electronService.isElectron )
      this.websocketService.messages$.subscribe((message) => {
        
          switch (message.tipo) {
            case 'message': if(message.message) console.log(`Message: ${message.message}`)
              
              break;
      
          case 'MousePos':  if (message.x && message.y) {
              console.log(`Mouse position: x=${message.x}, y=${message.y}`);
            }
              
              break;

          case 'Click': if (message.x && message.y) {
            console.log(`CLicked: X=${message.x}, Y=${message.y}`);
            if(this.electronService.isElectron){
                this.electronService.electronAPI.clickIn(message.x, message.y)
            }
          }
              break;
          case 'Gyroscope': if (message.alpha && message.beta && message.gamma) {
            if(this.electronService.isElectron){
            this.electronService.electronAPI.moveCursorTo(message.alpha! , message.beta!)
            }
              console.log(`Gyroscope data: alpha=${message.alpha}, beta=${message.beta}, gamma=${message.gamma}`);
            }
              
              break;
               
          case 'Accelerometer': if (message.x && message.y && message.z) {
            if(this.electronService.isElectron){
              this.electronService.electronAPI.moveCursorTo(message.x! , message.y!)            
            }
            console.log(`Accelerometer data: X=${message.x}, Y=${message.y}, Z=${message.z}`);
            }
              
              break;
                            
          default: 
              break;
          
         }
     
      });
    }
  }
  ngOnDestroy(): void {
    this.removeDeviceEventListeners();
  }

  initializeWebSocketConnection(): void {
    // const ipAddress = window.location.href.split('https://')[1].split('/')[0];
    this.websocketService.connect('192.168.0.129:443');
  }

  sendMessage(): void {
    const message = { tipo: 'message', message: 'Hi from Angular client' };
    this.websocketService.sendMessage(message);
  }

  addDeviceEventListeners(): void {
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);
    window.addEventListener('devicemotion', this.handleMotion.bind(this), true);
  }

  removeDeviceEventListeners(): void {
    window.removeEventListener('deviceorientation', this.handleOrientation.bind(this), true);
    window.removeEventListener('devicemotion', this.handleMotion.bind(this), true);
  }

  handleOrientation(event: DeviceOrientationEvent): void {
    const payload = {
      tipo: 'Gyroscope',
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    };
    this.websocketService.sendMessage(payload);
    this.websocketService.emitGyroscopeData(event.alpha!, event.beta!, event.gamma!);    
  }

  handleMotion(event: DeviceMotionEvent): void {
    if (event.acceleration) {
      const payload = {
        tipo: 'Accelerometer',
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z
      };
      this.websocketService.sendMessage(payload);
      this.websocketService.emitAccelerometerData(event.acceleration.x!, event.acceleration.y!, event.acceleration.z!);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const payload = { tipo: 'MousePos', x: event.clientX, y: event.clientY };
    this.websocketService.sendMessage(payload);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const payload = { tipo: 'Click', x: event.clientX, y: event.clientY };
    this.websocketService.sendMessage(payload);
    this.websocketService.emitClick(event.clientX, event.clientY);
  }
 
}