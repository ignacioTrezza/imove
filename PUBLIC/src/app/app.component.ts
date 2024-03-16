import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { WebsocketService } from './services/web-socket.service';
import { ElectronService } from './services/electron.service';

import { AnotherSubscriberComponent } from './componentes/another-subscriber/another-subscriber.component';
import { SensorMessage } from './core/interfaces/sensor.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [AnotherSubscriberComponent, CommonModule],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Imove';

  public electronService: ElectronService;

  constructor(
    private websocketService: WebsocketService,
    electronService: ElectronService) {
      this.electronService = electronService;
      if (this.electronService.isElectron) {
        // Use Electron APIs, e.g., this.electronService.electronAPI.moveCursorTo(...)
        console.log('electronServiceAPI',this.electronService.isElectron )
        // this.electronService.electronAPI.moveCursorTo(10, 10);
      }
    }

  ngOnInit(): void {
    this.initializeWebSocketConnection();
    this.addDeviceEventListeners();
    console.log('electronServiceAPIaa',this.electronService.isElectron )
    if(this.electronService.isElectron){
      // this.electronService.electronAPI.moveCursorTo(10, 10); // Assuming default values for x and y as 'data' is not defined
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
            // this.electronService.electronAPI.moveCursorTo(message.alpha! , message.gamma!)
            }
              console.log(`Gyroscope data: alpha=${message.alpha}, beta=${message.beta}, gamma=${message.gamma}`);
            }
              
              break;
               
          case 'Accelerometer': if (message.x && message.y && message.z) {
            if(this.electronService.isElectron){
              // this.electronService.electronAPI.moveCursorTo(message.x! , message.y!);  
              console.log(`Accelerometer data: X=${message.x}, Y=${message.y}, Z=${message.z}`);          
            }
           
            }
              
              break;

          case 'AccelerometerIncludingGravity':   if (message.x && message.y && message.z) {
            if(this.electronService.isElectron){
              // this.electronService.electronAPI.moveCursorTo(message.x, message.y);  
              console.log('ACELERGRAV:', message.x, message.y, message.z )
              this.websocketService.emitAccelerometerIncludingGravityData(message.x/10, message.y/10, message.z/10); 
            }
            // Emitting data to be used by any subscribing component
            
          }
              
              break;
                            
          default: 
              break;
          
         }
     
      });

      // Subscribe to the Click event
      this.websocketService.Click.subscribe(({ x, y }) => {
        console.log(`Click event received: X=${x}, Y=${y}`);
        if(this.electronService.isElectron){
          this.electronService.electronAPI.clickIn(x, y);
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
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response == 'granted') {
            window.addEventListener('devicemotion', (event) => {
              this.handleMotion(event);
            });
          } else {
            console.log('Permission to access motion and orientation was denied');
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', (event) => {
        this.handleMotion(event);
      });
    }
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
    if (event.accelerationIncludingGravity) {
      const payload = {
        tipo: 'AccelerometerIncludingGravity',
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z
      };
      this.websocketService.sendMessage(payload);
      this.websocketService.emitAccelerometerIncludingGravityData(event.accelerationIncludingGravity.x!, event.accelerationIncludingGravity.y!, event.accelerationIncludingGravity.z!);
      console.log('accelerationGRAVITY' ,event.accelerationIncludingGravity)
    } else if (event.acceleration) {
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