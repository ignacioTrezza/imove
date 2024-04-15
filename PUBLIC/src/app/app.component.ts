import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { WebsocketService } from './services/web-socket.service';
import { ElectronService } from './services/electron.service';


import { Store, select } from '@ngrx/store';
import { AppState } from './core/store/app.state';
import * as AppActions from './core/store/actions/app.actions';
import * as AppSelectors from './core/store/selectors/app.selectors';

declare global {
  interface Window { electronAPI: any; }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Imove';

  public electronService: ElectronService;

  qrCodeUrl: string | null = null;
  wifiQrCodeUrl: string | null = null;
  toggleRemoteClick!: boolean;
  toggleEventHandling!: boolean;
  toggleAccelerometer!: boolean;
  toggleAccelerometerIncludingGravity!: boolean;
  toggleGyroscope!: boolean;
  toggleClick!: boolean;
  toggleMousePos!: boolean;
  toggleClientEventHandling!: boolean;
  isSensorDataHandlingEnabled: boolean = false;

  constructor(
    private store: Store<AppState>,
    private websocketService: WebsocketService,
    electronService: ElectronService) {
      this.electronService = electronService;
      if (this.electronService.isElectron) {
        console.log('electronServiceAPI',this.electronService.isElectron )
      }
    }

  ngOnInit(): void {
    if (this.electronService.isElectron) {
      console.log('Running in Electron:', this.electronService.isElectron);

    
      this.electronService.electronAPI.getLocalIpAddress().then((ipAddress: any) => {
        console.log('Local IP Address:', ipAddress);
        this.websocketService.connect(ipAddress);
        this.generateQRCode(ipAddress)
        this.generateWifiQRCode();
      });
    }
    

    this.store.pipe(select(AppSelectors.selectToggleRemoteClick)).subscribe(toggleRemoteClick => {
      this.toggleRemoteClick = toggleRemoteClick;
          
    });
    this.store.pipe(select(AppSelectors.selectToggleEventHandling)).subscribe(toggleEventHandling => {
      this.toggleEventHandling = toggleEventHandling;
    });
    
    this.store.pipe(select(AppSelectors.selectToggleGyroscope)).subscribe(toggleGyroscope => {
      this.toggleGyroscope = toggleGyroscope;
    });
    this.store.pipe(select(AppSelectors.selectToggleAccelerometer)).subscribe(toggleAccelerometer => {
      this.toggleAccelerometer = toggleAccelerometer;
    });
    this.store.pipe(select(AppSelectors.selectToggleAccelerometerIncludingGravity)).subscribe(toggleAccelerometerIncludingGravity => {
      this.toggleAccelerometerIncludingGravity = toggleAccelerometerIncludingGravity;
    });
    this.store.pipe(select(AppSelectors.selectToggleClick)).subscribe(toggleClick => {
      this.toggleClick = toggleClick;
    });
    this.store.pipe(select(AppSelectors.selectToggleMousePos)).subscribe(toggleMousePos => {
      this.toggleMousePos = toggleMousePos;
    });
    this.store.pipe(select(AppSelectors.selectToggleClientEventHandling)).subscribe(toggleClientEventHandling => {
      this.toggleClientEventHandling = toggleClientEventHandling;
    });

    // this.initializeWebSocketConnection();
    this.addDeviceEventListeners();

    if(this.electronService.isElectron){

      this.websocketService.messages$.subscribe((message) => {        
          switch (message.tipo) {
            case 'message': if(message.message) console.log(`Message: ${message.message}`)              
              break;
      
          case 'MousePos':  if (this.toggleMousePos && message.x && message.y) {
              console.log(`Mouse position: x=${message.x}, y=${message.y}`);
              if (this.electronService.isElectron) {
                this.electronService.electronAPI.moveCursorTo(message.x, message.y);
              } else {
                // this.websocketService.emitProcessedPointerData(message.x, message.y, 0); // Z is not used for MousePos
              }
            }              
              break;

          case 'Click': if (this.toggleClick && message.x && message.y) {
            console.log(`Clicked: X=${message.x}, Y=${message.y}`);
            if(this.electronService.isElectron){
                this.electronService.electronAPI.clickIn(message.x, message.y);
            } else {
              if (this.toggleRemoteClick) {
                //Ya lo emitiste el evento por webSocket.. Lo estas recibiendo aca de hecho!
                // this.websocketService.emitClick(message.x, message.y);
              }
            }
          }
              break;

          case 'Gyroscope': if (this.toggleGyroscope && message.alpha && message.beta && message.gamma) {
            console.log(`Gyroscope data: alpha=${message.alpha}, beta=${message.beta}, gamma=${message.gamma}`);
            if(this.electronService.isElectron){
              if(this.toggleMousePos){
                this.electronService.electronAPI.moveCursorTo(message.alpha!-180/10 , message.gamma!)
              }else if(this.toggleEventHandling){//Mover CANVAS con sensores
                //Localmente emito un subjectpara ACIGDATA... (Al cual, me subscribo en real-express.component.ts)
                this.websocketService.sendGyroscopeData(message.alpha!-180/10, message.beta!, message.gamma!);
              }
           
            } 
          }            
              break;
               
          case 'Accelerometer': if (this.toggleAccelerometer  && message.x && message.y && message.z) {
            console.log(`Accelerometer data: X=${message.x}, Y=${message.y}, Z=${message.z}`);
            if(this.electronService.isElectron){
              if(this.toggleMousePos){
                this.electronService.electronAPI.moveCursorTo(message.x! , message.y!);
              }else if(this.toggleEventHandling){//Mover CANVAS con sensores
               //Localmente emito un subjectpara ACIGDATA... (Al cual, me subscribo en real-express.component.ts)
                this.websocketService.sendAccelerometerData(message.x, message.y, message.z);
              }
            }
          }              
              break;

          case 'AccelerometerIncludingGravity':   if (this.toggleAccelerometerIncludingGravity && message.x && message.y && message.z) {
            console.log('ACELERGRAV:', message.x, message.y, message.z );
            if(this.electronService.isElectron){
              if(this.toggleMousePos){
                this.electronService.electronAPI.moveCursorTo(message.x!, message.y!);
              }else if(this.toggleEventHandling){//Mover CANVAS con sensores
                //Localmente emito un subjectpara ACIGDATA... (Al cual, me subscribo en real-express.component.ts)
                this.websocketService.sendAccelerometerIncludingGravityData(message.x, message.y, message.z);
              }
            }
          }          
              break;
                            
          default: 
              break;          
         }
     
      });
    }

  }
  async generateQRCode(ipAddress: string) {
    if (this.electronService.isElectron) {
      try {
        this.qrCodeUrl = await this.electronService.electronAPI.qrMagic(ipAddress);
        console.log('QRCode',this.qrCodeUrl);
        // You can now use qrCodeUrl to display the QR code in your UI
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  }
  async generateWifiQRCode() {
    if (this.electronService.isElectron) {
      try {
        this.wifiQrCodeUrl = await this.electronService.electronAPI.qrWifi();
        console.log('WIFI QRCode',this.wifiQrCodeUrl);
        // You can now use qrCodeUrl to display the QR code in your UI
      } catch (error) {
        console.error('Error generating WIFI QR code:', error);
      }
    }
  }
  ngOnDestroy(): void {
    this.removeDeviceEventListeners();
  }


  sendMessage(): void {
    const message = { tipo: 'message', message: 'Hi from Angular client' };
    this.websocketService.sendMessage(message);
  }

   // Method to toggle remote click behavior
   public toggleRemoteClickHandling(): void {
    this.store.dispatch(AppActions.toggleRemoteClickHandling());
  }

  // Method to toggle event handling behavior
  public toggleEventHandlingCanvas(): void {
    this.store.dispatch(AppActions.toggleEventHandling());
  }

  // Add methods to toggle specific event handling (accelerometer, gyroscope, etc.)
  public toggleAccelerometerHandling(): void {
    this.store.dispatch(AppActions.toggleAccelerometerHandling());
  }
  public toggleAccelerometerIncludingGravityHandling(): void {
    this.store.dispatch(AppActions.toggleAccelerometerIncludingGravityHandling());
  }
  public toggleGyroscopeHandling(): void {
    this.store.dispatch(AppActions.toggleGyroscopeHandling());
  }
  public toggleClickHandling(): void {
    this.store.dispatch(AppActions.toggleClickHandling());
  }
  public toggleMousePosHandling(): void {
    this.store.dispatch(AppActions.toggleMousePosHandling());
  }
  public toggleShowCanvasClientHandling(): void {
    if (this.electronService.isElectron) {
      this.store.dispatch(AppActions.toggleClientEventHandling());
    }
  }

  public toggleSensorDataHandling(): void {
    this.isSensorDataHandlingEnabled = !this.isSensorDataHandlingEnabled;
    this.isSensorDataHandlingEnabled ? this.addDeviceEventListeners() : this.removeDeviceEventListeners();
  }

  addDeviceEventListeners(): void {
    if(!this.electronService.isElectron && this.isSensorDataHandlingEnabled){
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
  }

  removeDeviceEventListeners(): void {
    if(!this.electronService.isElectron){
    window.removeEventListener('deviceorientation', this.handleOrientation.bind(this), true);
    window.removeEventListener('devicemotion', this.handleMotion.bind(this), true);
    }
  }

  handleOrientation(event: DeviceOrientationEvent): void {
    if(!this.electronService.isElectron && this.isSensorDataHandlingEnabled){
    if (this.toggleGyroscope) {
      const payload = {
        tipo: 'Gyroscope',
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      };
      if (this.toggleMousePos || this.toggleEventHandling){
        this.websocketService.sendMessage(payload);
      }
    }
  }
}

  handleMotion(event: DeviceMotionEvent): void {

    if(!this.electronService.isElectron && this.isSensorDataHandlingEnabled){

      if (event.accelerationIncludingGravity && this.toggleAccelerometerIncludingGravity) {
        const payload = {
          tipo: 'AccelerometerIncludingGravity',
          x: event.accelerationIncludingGravity.x,
          y: event.accelerationIncludingGravity.y,
          z: event.accelerationIncludingGravity.z
        };
        if(this.toggleMousePos || this.toggleEventHandling){
          this.websocketService.sendMessage(payload);
        }
      } else if (event.acceleration && this.toggleAccelerometer) {
        const payload = {
          tipo: 'Accelerometer',
          x: event.acceleration.x,
          y: event.acceleration.y,
          z: event.acceleration.z
        };
        if(this.toggleMousePos || this.toggleEventHandling){
          this.websocketService.sendMessage(payload);
        }
      }
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if(!this.electronService.isElectron && this.isSensorDataHandlingEnabled){
      event.preventDefault(); // Prevent any default action.
      if (this.toggleMousePos ) {
        const payload = { tipo: 'MousePos', x: event.clientX, y: event.clientY };
        this.websocketService.sendMessage(payload);
      }
    }
  }
  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if(!this.electronService.isElectron && this.isSensorDataHandlingEnabled){
      event.preventDefault(); // Prevent any default action.
      if (this.toggleMousePos) {
        const payload = { tipo: 'MousePos', x: event.touches[0].clientX, y: event.touches[0].clientY };
        this.websocketService.sendMessage(payload);
      }
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if(!this.electronService.isElectron && this.isSensorDataHandlingEnabled){
      // event.preventDefault(); // Prevent any default action.
      if (this.toggleClick) {
        const payload = { tipo: 'Click', x: event.clientX, y: event.clientY };
        console.log('CLICKRegistered', payload)
        this.websocketService.sendMessage(payload);
        
        if (this.toggleRemoteClick) {
          // this.websocketService.emitClick(event.clientX, event.clientY);
        }
      }
    }
  }
 
}