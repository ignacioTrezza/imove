import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { WebsocketService } from '../../services/web-socket.service';
import * as THREE from 'three';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { ElectronService } from '../../services/electron.service';
import * as AppSelectors from '../../core/store/selectors/app.selectors';
import { movementMode } from '../../core/interfaces/sensor.interfaces';
import * as AppActions from '../../core/store/actions/app.actions';

@Component({
  selector: 'app-real-express',
  standalone: false,
  templateUrl: './real-express.component.html',
  styleUrls: ['./real-express.component.scss']
})
export class RealExpressComponent implements OnInit, OnDestroy, AfterViewInit {

  currentMode: 'cubeRotation' | 'cubePosition' | 'sceneRotation' | 'scenePosition' | 'cameraRotation' | 'cameraPosition' | null = 'cubeRotation';

  private prevAccelIncludingGravityX: number = 0;
  private prevAccelIncludingGravityY: number = 0;
  private prevAccelIncludingGravityZ: number = 0;

  private prevAccelerationX: number = 0;
  private prevAccelerationY: number = 0;
  private prevAccelerationZ: number = 0;

  private prevGyroscopeAlpha: number = 0;
  private prevGyroscopeBeta: number = 0;
  private prevGyroscopeGamma: number = 0;

  toggleRemoteClick: boolean = false;
  toggleEventHandling: boolean = false;
  toggleAccelerometer: boolean = false;
  toggleAccelerometerIncludingGravity: boolean = false;
  toggleGyroscope: boolean = false;
  toggleClick: boolean = false;
  toggleMousePos: boolean = false;
  toggleClientEventHandling: boolean = false

  public accelSubscription!: Subscription;
  public gyroSubscription!: Subscription;
  public accelIncludingGravitySubscription!: Subscription;
  public processedPointerSubscription!: Subscription;

  public gyroAlpha$ = new BehaviorSubject<number>(0);
  public gyroBeta$ = new BehaviorSubject<number>(0);
  public gyroGamma$ = new BehaviorSubject<number>(0);

  public accelX$ = new BehaviorSubject<number>(0);
  public accelY$ = new BehaviorSubject<number>(0);
  public accelZ$ = new BehaviorSubject<number>(0);

  public accelIncludingGravityX$ = new BehaviorSubject<number>(0);
  public accelIncludingGravityY$ = new BehaviorSubject<number>(0);
  public accelIncludingGravityZ$ = new BehaviorSubject<number>(0);

  public newX$ = new BehaviorSubject<number>(0);
  public newY$ = new BehaviorSubject<number>(0);
  public newZ$ = new BehaviorSubject<number>(0);
  // public toggleClientEventHandling$ = new BehaviorSubject<boolean>(false);



  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry!: THREE.BoxGeometry;
  private material!: THREE.MeshBasicMaterial;
  private cube!: THREE.Mesh;

  private isDragging: boolean = false;
  private previousX: number = 0;
  private previousY: number = 0;
  public importedCubes: THREE.Mesh[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private websocketService: WebsocketService,
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {
    this.initThree();
    this.initializeStoreEvents();
  }

  initializeStoreEvents() {
    if (this.electronService.isElectron) {

      this.store.pipe(select(AppSelectors.selectToggleRemoteClick)).subscribe(toggleRemoteClick => {
        this.toggleRemoteClick = toggleRemoteClick;
        this.handleClientEvent(this.toggleRemoteClick);
      });

      this.store.pipe(select(AppSelectors.selectToggleEventHandling)).subscribe(toggleEventHandling => {
        this.toggleEventHandling = toggleEventHandling;
        // if (this.toggleEventHandling === true) {
          // console.log('EVENT HANDLING11', this.toggleEventHandling);

        //   let parsedData = { x: 0, y: 0, z: 0 };

        //   if (this.toggleAccelerometer === true) {
        //     parsedData = { ...parsedData, x: this.accelX$.value, y: this.accelY$.value, z: this.accelZ$.value }
        //   }
        //   if (this.toggleAccelerometerIncludingGravity === true) {
        //     parsedData = { ...parsedData, x: this.accelIncludingGravityX$.value, y: this.accelIncludingGravityY$.value, z: this.accelIncludingGravityZ$.value }
        //   }
        //   if (this.toggleGyroscope === true) {
        //     parsedData = { ...parsedData, x: this.gyroAlpha$.value, y: this.gyroBeta$.value, z: this.gyroGamma$.value }
        //   }
        //   console.log('VALUE:', this.cube.position.x, this.cube.position.y, this.cube.position.z);

        //   if (parsedData.x !== null && parsedData.y !== null && parsedData.z !== null) {

        //     const deltaX = parsedData.x - this.prevAccelIncludingGravityX;
        //     const deltaY = parsedData.y - this.prevAccelIncludingGravityY;

        //     this.switchMode(this.currentMode, deltaX, deltaY);

        //     this.prevAccelIncludingGravityX = parsedData.x;
        //     this.prevAccelIncludingGravityY = parsedData.y;

        //   } else {
        //     console.log('XYZ:', parsedData.x, parsedData.y, parsedData.z, this.cube.position.x, this.cube.position.y, this.cube.position.z);
        //   }
        // }
      });

      this.store.pipe(select(AppSelectors.selectToggleGyroscope)).subscribe(toggleGyroscope => {
        this.toggleGyroscope = toggleGyroscope;
        if (this.toggleGyroscope === true) {
          this.gyroSubscription = this.websocketService.gyroscopeData.subscribe(({ alpha, beta, gamma }) => {
            console.log(`Gyroscope: alpha=${alpha}, beta=${beta}, gamma=${gamma}`);
            const deltaX = alpha - this.previousX;
            const deltaY = beta - this.previousY;

            this.switchMode(this.currentMode, deltaX, deltaY);

            this.previousX = alpha;
            this.previousY = beta;
            // this.previousZ = gamma;
            // Handle gyroscope data
          });
        } else {
          if (this.gyroSubscription) {
            this.gyroSubscription.unsubscribe();
          }
        }
      });

      this.store.pipe(select(AppSelectors.selectToggleAccelerometer)).subscribe(toggleAccelerometer => {
        this.toggleAccelerometer = toggleAccelerometer;
        if (this.toggleAccelerometer === true) {
          this.accelSubscription = this.websocketService.accelerometerData.subscribe(({ x, y, z }) => {
            console.log(`Accelerometer en real-express160: x=${x}, y=${y}, z=${z} `);
            const deltaX = x - this.previousX;
            const deltaY = y - this.previousY;

            this.switchMode(this.currentMode, deltaX, deltaY);

            this.previousX = x;
            this.previousY = y;
            // this.previousZ = z;
            // Handle accelerometer data
          });
        } else {
          if (this.accelSubscription) {
            this.accelSubscription.unsubscribe();
          }
        }
      });

      this.store.pipe(select(AppSelectors.selectToggleAccelerometerIncludingGravity)).subscribe(toggleAccelerometerIncludingGravity => {
        this.toggleAccelerometerIncludingGravity = toggleAccelerometerIncludingGravity;
        if (this.toggleAccelerometerIncludingGravity === true) {
          this.accelIncludingGravitySubscription = this.websocketService.accelerometerIncludingGravityData
            .subscribe(({ x, y, z }) => {
              console.log(`Accelerometer Including Gravity: x=${x}, y=${y}, z=${z}`);
              const deltaX = x - this.previousX;
              const deltaY = y - this.previousY;
  
              this.switchMode(this.currentMode, deltaX, deltaY);
  
              this.previousX = x;
              this.previousY = y;
            })
        } else {
          if (this.accelIncludingGravitySubscription) {
            this.accelIncludingGravitySubscription.unsubscribe();
          }
        }
      });

      // this.store.pipe(select(AppSelectors.selectToggleClick)).subscribe(toggleClick => {
      //   this.toggleClick = toggleClick;
      // });
      // this.store.pipe(select(AppSelectors.selectToggleMousePos)).subscribe(toggleMousePos => {
      //   this.toggleMousePos = toggleMousePos;
      //   this.processedPointerSubscription = this.websocketService.processedPointerData.subscribe(({ x, y, z }) => {
      //     //     console.log(`Processed Pointer: x=${x}, y=${y}, z=${z}`);
      //     //     this.newX = x;
      //     //     this.newY = y;
      //     //     this.newZ = z;
      //     //     // Handle processed pointer data
      //     //   });
      //     // } else {
      //     //   this.processedPointerSubscription.unsubscribe();
      //     // }
      //   });

      // }

      // )
      this.store.pipe(select(AppSelectors.selectToggleClientEventHandling)).subscribe(toggleClientEventHandling => {
        this.toggleClientEventHandling = toggleClientEventHandling;
      });
      this.store.pipe(select(AppSelectors.selectSetMovementMode)).subscribe(setMovementMode => {
        this.currentMode = setMovementMode;
      });
    }
  
  }
  // moveCursorBasedOnAcceleration(currentX: number, currentY: number, x: number, y: number, z: number): void {
  //   if (
  //     this.electronService.isElectron) {
  //     // Normalize acceleration data to a range that suits your screen size and preferences
  //     const sensitivity = 10; // Adjust this based on your needs
  //     let deltaX = x * sensitivity;
  //     let deltaY = y * sensitivity;

  //     // Calculate new position
  //     this.newX = currentX + deltaX;
  //     this.newY = currentY - deltaY; // Subtract deltaY because screen coordinates in Y are inverted
  //     this.newZ = 0;
  //     // Boundary checks (assuming screen resolution of 1920x1080, adjust as needed)
  //     this.newX = Math.max(0, Math.min(this.newX, 1920));
  //     this.newY = Math.max(0, Math.min(this.newY, 1080));
  //     // Handle accelerometer including gravity data
  //     this.websocketService.emitProcessedPointerData(this.newX, this.newY, this.newZ);
  //   }
  // };
  public setMovementMode(mode: movementMode): void {
    if (this.electronService.isElectron) {
      this.store.dispatch(AppActions.setMovementMode({ mode: mode }));
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('mouseup', this.mouseUpListener);
    document.removeEventListener('mousedown', this.mouseDownListener);
    document.removeEventListener('mousemove', this.mouseMoveListener);
    // this.accelSubscription.unsubscribe();
    // this.gyroSubscription.unsubscribe();
    // this.accelIncludingGravitySubscription.unsubscribe();
    // this.processedPointerSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    document.getElementById('threejs-container')!.append(this.renderer.domElement);
    this.animate();
    document.getElementById('threejs-container')!.addEventListener('wheel', (event) => {
      event.preventDefault();
      const delta = event.deltaY * 0.01;
      this.camera.position.z += delta;
    });
    this.initializeStoreEvents();
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500);
    this.renderer = new THREE.WebGLRenderer();
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.position.y = Math.random() * 10;
    this.cube.position.x = Math.random() * 10;
    this.cube.position.z = Math.random() * 10;
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = Math.random() * 10;
      cube.position.x = Math.random() * 10;
      cube.position.z = Math.random() * 10;
      this.scene.add(cube);
    }
    this.scene.add(this.cube);
    this.camera.position.z = 100;
    const axisX = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0xffaafff }));
    const axisY = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 0.1), new THREE.MeshBasicMaterial({ color: 0xffbbff }));
    const axisZ = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 10), new THREE.MeshBasicMaterial({ color: 0xffccff }));

    axisX.position.set(5, 0, 0);
    axisY.position.set(0, 5, 0);
    axisZ.position.set(0, 0, 5);

    this.scene.add(axisX, axisY, axisZ);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    console.log(`Key pressed: ${event.key}`);
  }
  private mouseUpListener = (event: MouseEvent) => {
    this.isDragging = false;
  };
  private mouseDownListener = (event: MouseEvent) => {
    console.log('mousedown', event);
    this.isDragging = true;
    this.previousX = event.clientX;
    this.previousY = event.clientY;
    document.addEventListener('mouseup', this.mouseUpListener);

  };
  private mouseMoveListener = (event: MouseEvent) => {

    if (this.isDragging) {
      const deltaX = event.clientX - this.previousX;
      const deltaY = event.clientY - this.previousY;

      this.switchMode(this.currentMode, deltaX, deltaY);

      this.previousX = event.clientX;
      this.previousY = event.clientY;

    }

  };
  private handleClientEvent(status: boolean): void {

    if (status == true) {
      console.log('REMOTE CLICK ACTIVADO');

      document.getElementById('threejs-container')!.addEventListener('mousedown', this.mouseDownListener);
      document.addEventListener('mousemove', this.mouseMoveListener);
      document.getElementById('threejs-container')!.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });
    } else {
      console.log('REMOTE CLICK DESACTIVADO');
      document.removeEventListener('mousedown', this.mouseDownListener);
      document.removeEventListener('mousemove', this.mouseMoveListener);
      this.mouseUpListener
      // document.removeEventListener('keydown', this.handleKeyDown.bind(this));
      // document.removeEventListener('mouseup', this.mouseUpListener);
      // document.removeEventListener('mousedown', this.mouseUpListener);
      // document.removeEventListener('mousemove', this.mouseUpListener);

    }

  }
  switchMode(currentMode: any, deltaX: number, deltaY: number) {
    switch (currentMode) {
      case 'cubeRotation':
        this.cube.rotation.x += deltaX * 0.005;
        this.cube.rotation.y += deltaY * 0.005;
        break;
      case 'cubePosition':
        this.cube.position.x += deltaX * 0.01;
        this.cube.position.y -= deltaY * 0.01;
        break;
      case 'sceneRotation':
        this.scene.rotation.y += deltaX * 0.005;
        this.scene.rotation.x += deltaY * 0.005;
        break;
      case 'scenePosition':
        this.scene.position.x += deltaX * 0.01;
        this.scene.position.y += deltaY * -0.01;
        break;
      case 'cameraRotation':
        this.camera.rotation.x += deltaX * -0.01;
        this.camera.rotation.y -= deltaY * -0.01;
        break;

      case 'cameraPosition':
        this.camera.position.x += deltaX * 0.01;
        this.camera.position.y -= deltaY * 0.01;
        break;
      default:
        this.cube.rotation.x += deltaX * 0.005;
        this.cube.rotation.y += deltaY * 0.005;
        console.log('Modo por defecto (cubeRotation) ACTIVADO.');
        break;

    }

    return

  }
  setMode(mode: movementMode): void {
    this.currentMode = mode;
    console.log(`Mode set to: ${mode}`);
  }
}
