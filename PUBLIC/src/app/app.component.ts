import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { WebsocketService } from './services/web-socket.service';
import { ElectronService } from './services/electron.service';


import { Store, select } from '@ngrx/store';
import { AppState } from './core/store/app.state';
import * as AppActions from './core/store/actions/app.actions';
import * as AppSelectors from './core/store/selectors/app.selectors';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Imove';

  public electronService: ElectronService;

  // Flags to enable/disable event handling
  toggleRemoteClick$!: Observable<boolean>;
  toggleEventHandling$!: Observable<boolean>;
  toggleAccelerometer$!: Observable<boolean>;
  toggleAccelerometerIncludingGravity$!: Observable<boolean>;
  toggleGyroscope$!: Observable<boolean>;
  toggleClick$!: Observable<boolean>;
  toggleMousePos$!: Observable<boolean>;

  toggleRemoteClickk!: boolean;
  toggleEventHandlingg!: boolean;
  toggleAccelerometerr!: boolean;
  toggleAccelerometerIncludingGravityy!: boolean;
  toggleGyroscopee!: boolean;
  toggleClickk!: boolean;
  toggleMousePoss!: boolean;

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
    this.store.pipe(select(AppSelectors.selectToggleEventHandling)).subscribe(toggleEventHandling => {
      this.toggleEventHandlingg = toggleEventHandling;
    });
    // this.toggleEventHandling$ = this.store.select(state => state.toggleEventHandling);

    this.store.pipe(select(AppSelectors.selectToggleRemoteClick)).subscribe(toggleRemoteClick => {
      this.toggleRemoteClickk = toggleRemoteClick;
    });
    // this.toggleRemoteClick$ = this.store.select(state => state.toggleRemoteClick);
    this.store.pipe(select(AppSelectors.selectToggleGyroscope)).subscribe(toggleGyroscope => {
      this.toggleGyroscopee = toggleGyroscope;
    });
    this.store.pipe(select(AppSelectors.selectToggleAccelerometer)).subscribe(toggleAccelerometer => {
      this.toggleAccelerometerr = toggleAccelerometer;
    });
    this.store.pipe(select(AppSelectors.selectToggleAccelerometerIncludingGravity)).subscribe(toggleAccelerometerIncludingGravity => {
      this.toggleAccelerometerIncludingGravityy = toggleAccelerometerIncludingGravity;
    });
    this.store.pipe(select(AppSelectors.selectToggleClick)).subscribe(toggleClick => {
      this.toggleClickk = toggleClick;
    });
    this.store.pipe(select(AppSelectors.selectToggleMousePos)).subscribe(toggleMousePos => {
      this.toggleMousePoss = toggleMousePos;
    });
    
    //Old way
    // this.toggleEventHandling$ = this.store.select(state => state.toggleEventHandling);
    // this.toggleRemoteClick$ = this.store.select(state => state.toggleRemoteClick);
    // this.toggleGyroscope$ = this.store.select(state => state.toggleGyroscope);
    // this.toggleAccelerometer$ = this.store.select(state => state.toggleAccelerometer);
    // this.toggleAccelerometerIncludingGravity$ = this.store.select(state => state.toggleAccelerometerIncludingGravity);
    // this.toggleClick$ = this.store.select(state => state.toggleClick);
    // this.toggleMousePos$ = this.store.select(state => state.toggleMousePos);
    this.initializeWebSocketConnection();
    this.addDeviceEventListeners();
    console.log('electronServiceAPIaa',this.electronService.isElectron )
    if(this.electronService.isElectron){
      console.log('electronServiceAPI',this.electronService.isElectron )
      this.websocketService.messages$.subscribe((message) => {
        
          switch (message.tipo) {
            case 'message': if(message.message) console.log(`Message: ${message.message}`)
              
              break;
      
          case 'MousePos':  if (this.toggleMousePos$ && message.x && message.y) {
              console.log(`Mouse position: x=${message.x}, y=${message.y}`);
              if (this.electronService.isElectron) {
                this.electronService.electronAPI.moveCursorTo(message.x, message.y);
              } else {
                this.websocketService.emitProcessedPointerData(message.x, message.y, 0); // Z is not used for MousePos
              }
            }
              
              break;

          case 'Click': if (this.toggleClick$ && message.x && message.y) {
            console.log(`Clicked: X=${message.x}, Y=${message.y}`);
            if(this.electronService.isElectron){
                this.electronService.electronAPI.clickIn(message.x, message.y);
            } else {
              if (this.toggleRemoteClick$) {
                this.websocketService.emitClick(message.x, message.y);
              }
            }
          }
              break;
          case 'Gyroscope': if (this.toggleGyroscope$ && message.alpha && message.beta && message.gamma) {
            console.log(`Gyroscope data: alpha=${message.alpha}, beta=${message.beta}, gamma=${message.gamma}`);
            if(this.electronService.isElectron){
            this.electronService.electronAPI.moveCursorTo(message.alpha! , message.gamma!)
            } else {
                // this.websocketService.emitGyroscopeData(message.alpha, message.beta, message.gamma);
            }
          }
              
              break;
               
          case 'Accelerometer': if (this.toggleAccelerometer$ && message.x && message.y && message.z) {
            console.log(`Accelerometer data: X=${message.x}, Y=${message.y}, Z=${message.z}`);
            if(this.electronService.isElectron){
              this.electronService.electronAPI.moveCursorTo(message.x! , message.y!);  
            } else {
                // this.websocketService.emitAccelerometerData(message.x, message.y, message.z);
            }
          }
              
              break;

          case 'AccelerometerIncludingGravity':   if (this.toggleAccelerometerIncludingGravity$ && message.x && message.y && message.z) {
            console.log('ACELERGRAV:', message.x, message.y, message.z );
            if(this.electronService.isElectron){
              this.electronService.electronAPI.moveCursorTo(message.x, message.y);  
              // this.websocketService.emitAccelerometerIncludingGravityData(message.x/10, message.y/10, message.z/10); 
            } else {
                // this.websocketService.emitAccelerometerIncludingGravityData(message.x, message.y, message.z);
            }
          }
              
              break;
                            
          default: 
              break;
          
         }
     
      });

      this.websocketService.Click.subscribe(({ x, y }) => {
        console.log(`Click event received: X=${x}, Y=${y}`);
        if(this.toggleClick$ && this.electronService.isElectron){
          this.electronService.electronAPI.clickIn(x, y);
        } else {
            if (this.toggleRemoteClick$) {
              this.websocketService.emitClick(x, y);
            }
        }
      });
    }
    // this.websocketService.toggleRemoteClick.subscribe(enabled => {
      // this.toggleRemoteClick$ = this.websocketService.toggleRemoteClick.asObservable();   
    //  });
  }
  ngOnDestroy(): void {
    this.removeDeviceEventListeners();
  }

  initializeWebSocketConnection(): void {
    this.websocketService.connect('192.168.0.129:443');
  }

  sendMessage(): void {
    const message = { tipo: 'message', message: 'Hi from Angular client' };
    this.websocketService.sendMessage(message);
  }

   // Method to toggle remote click behavior
   public toggleRemoteClick(): void {
    // this.enableRemoteClick$ = !this.enableRemoteClick$;
    // this.websocketService.toggleRemoteClick.emit(this.enableRemoteClick)
    this.store.dispatch(AppActions.toggleRemoteClickHandling());
  }

  // Method to toggle event handling behavior
  public toggleEventHandling(): void {
    // this.enableEventHandling = !this.enableEventHandling;
    this.store.dispatch(AppActions.toggleEventHandling());
    // Implement logic to enable/disable event handling based on this flag
  }

  // Add methods to toggle specific event handling (accelerometer, gyroscope, etc.)
  public toggleAccelerometerHandling(): void {
    // this.handleAccelerometer$ = !this.handleAccelerometer$;
    this.store.dispatch(AppActions.toggleAccelerometerHandling());
    // Add logic to enable/disable accelerometer event handling
  }
  public toggleAccelerometerIncludingGravityHandling(): void {
    // this.handleAccelerometerIncludingGravity$ = !this.handleAccelerometerIncludingGravity$;
    this.store.dispatch(AppActions.toggleAccelerometerIncludingGravityHandling());
  }
  public toggleGyroscopeHandling(): void {
    // this.handleGyroscope$ = !this.handleGyroscope$;
    this.store.dispatch(AppActions.toggleGyroscopeHandling());
  }
  public toggleClickHandling(): void {
    // this.handleClick$ = !this.handleClick$;
    this.store.dispatch(AppActions.toggleClickHandling());
  }
  public toggleMousePosHandling(): void {
    // this.handleMousePos$ = !this.handleMousePos$;
    this.store.dispatch(AppActions.toggleMousePosHandling());
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
    if (this.toggleGyroscope$) {
      const payload = {
        tipo: 'Gyroscope',
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      };
      
      this.websocketService.sendMessage(payload);
      this.websocketService.emitGyroscopeData(event.alpha!, event.beta!, event.gamma!);    
    }
  }

  handleMotion(event: DeviceMotionEvent): void {
    if (event.accelerationIncludingGravity && this.toggleAccelerometerIncludingGravity$) {
      const payload = {
        tipo: 'AccelerometerIncludingGravity',
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z
      };
      this.websocketService.sendMessage(payload);
      this.websocketService.emitAccelerometerIncludingGravityData(event.accelerationIncludingGravity.x!, event.accelerationIncludingGravity.y!, event.accelerationIncludingGravity.z!);
      console.log('accelerationGRAVITY' ,event.accelerationIncludingGravity)
    } else if (event.acceleration && this.toggleAccelerometer$) {
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
    event.preventDefault(); // Prevent any default action.
    if (this.toggleMousePos$) {
      const payload = { tipo: 'MousePos', x: event.clientX, y: event.clientY };
      this.websocketService.sendMessage(payload);
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault(); // Prevent any default action.
    if (this.toggleClick$) {
      const payload = { tipo: 'Click', x: event.clientX, y: event.clientY };
      this.websocketService.sendMessage(payload);
      if (this.toggleRemoteClick$) {
        this.websocketService.emitClick(event.clientX, event.clientY);
      }
    }
  }
 
}