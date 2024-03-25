import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/web-socket.service';
import * as THREE from 'three';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { ElectronService } from '../../services/electron.service';
import * as AppSelectors from '../../core/store/selectors/app.selectors';
@Component({
  selector: 'app-real-express',
  standalone: false,
  templateUrl: './real-express.component.html',
  styleUrls: ['./real-express.component.scss']
})
export class RealExpressComponent implements OnInit, OnDestroy, AfterViewInit {

  currentMode: 'cubeRotation' | 'cubePosition' | 'sceneRotation' | 'scenePosition' | 'cameraRotation' | 'cameraPosition' | null = null;


  toggleRemoteClickk!: boolean;
  toggleEventHandlingg!: boolean;
  toggleAccelerometerr!: boolean;
  toggleAccelerometerIncludingGravityy!: boolean;
  toggleGyroscopee!: boolean;
  toggleClickk!: boolean;
  toggleMousePoss!: boolean;
  toggleClientEventHandlingg!: boolean;


  public accelSubscription!: Subscription;
  public gyroSubscription!: Subscription;
  public accelIncludingGravitySubscription!: Subscription;
  public processedPointerSubscription!: Subscription;

  public gyroAlpha: number = 0;
  public gyroBeta: number = 0;
  public gyroGamma: number = 0;

  public accelX: number = 0;
  public accelY: number = 0;
  public accelZ: number = 0;

  public accelIncludingGravityX: number = 0;
  public accelIncludingGravityY: number = 0;
  public accelIncludingGravityZ: number = 0;

  public newX: number = 0;
  public newY: number = 0;
  public newZ: number = 0;
  public toggleClientEventHandling: boolean = false;


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
        this.toggleRemoteClickk = toggleRemoteClick;
      });

      this.store.pipe(select(AppSelectors.selectToggleEventHandling)).subscribe(toggleEventHandling => {
        this.toggleEventHandlingg = toggleEventHandling;
      });

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
      this.store.pipe(select(AppSelectors.selectToggleClientEventHandling)).subscribe(toggleClientEventHandling => {
        this.toggleClientEventHandlingg = toggleClientEventHandling;
      });

      if (this.toggleRemoteClickk) {
        this.handleClientEvent();
      } else {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('mouseup', this.mouseUpListener);
        document.removeEventListener('mousedown', this.mouseUpListener);
        document.removeEventListener('mousemove', this.mouseUpListener);
      }
      if (this.toggleEventHandlingg) {
        let parsedData = { x: 0, y: 0, z: 0 };

        if (this.toggleAccelerometerr) {
          parsedData = { ...parsedData, x: this.accelX, y: this.accelY, z: this.accelZ }
        }
        if (this.toggleAccelerometerIncludingGravityy) {
          parsedData = { ...parsedData, x: this.accelIncludingGravityX, y: this.accelIncludingGravityY, z: this.accelIncludingGravityZ }
        }
        if (this.toggleGyroscopee) {
          parsedData = { ...parsedData, x: this.gyroAlpha, y: this.gyroBeta, z: this.gyroGamma }
        }
        console.log(this.cube.position.x, this.cube.position.y, this.cube.position.z);

        if (parsedData.x !== null && parsedData.y !== null && parsedData.z !== null) {

          const deltaX = parsedData.x - this.previousX;
          const deltaY = parsedData.y - this.previousY;
  
          this.switchMode(this.currentMode, deltaX, deltaY);
           
          this.previousX = parsedData.x;
          this.previousY = parsedData.y;
  
        }else {
          console.log('XYZ:', parsedData.x, parsedData.y, parsedData.z, this.cube.position.x, this.cube.position.y, this.cube.position.z);
        }
      }
    
      if (this.toggleAccelerometerr) {
        this.accelSubscription = this.websocketService.accelerometerData.subscribe(({ x, y, z }) => {
          console.log(`Accelerometer: x=${x}, y=${y}, z=${z}`);
          this.accelX = x;
          this.accelY = y;
          this.accelZ = z;
          // Handle accelerometer data
        });
      } else {
        this.accelSubscription.unsubscribe();
      }

      // if (this.toggleMousePoss) {
      //   this.processedPointerSubscription = this.websocketService.processedPointerData.subscribe(({ x, y, z }) => {
      //     console.log(`Processed Pointer: x=${x}, y=${y}, z=${z}`);
      //     this.newX = x;
      //     this.newY = y;
      //     this.newZ = z;
      //     // Handle processed pointer data
      //   });
      // } else {
      //   this.processedPointerSubscription.unsubscribe();
      // }

      if (this.toggleGyroscopee) {
        this.gyroSubscription = this.websocketService.gyroscopeData.subscribe(({ alpha, beta, gamma }) => {
          console.log(`Gyroscope: alpha=${alpha}, beta=${beta}, gamma=${gamma}`);
          this.gyroAlpha = alpha;
          this.gyroBeta = beta;
          this.gyroGamma = gamma;
          // Handle gyroscope data
        });
      } else {
        this.gyroSubscription.unsubscribe();
      }

      if (this.toggleAccelerometerIncludingGravityy) {
        this.accelIncludingGravitySubscription = this.websocketService.accelerometerIncludingGravityData
          .subscribe(({ x, y, z }) => {
            console.log(`Accelerometer Including Gravity: x=${x}, y=${y}, z=${z}`);
            this.accelIncludingGravityX = x;
            this.accelIncludingGravityY = y;
            this.accelIncludingGravityZ = z;
          })
      } else {
        this.accelIncludingGravitySubscription.unsubscribe();
      }
    }


    this.websocketService.handleClientEvent.subscribe((value) => {
      if (value) {
        if (this.toggleRemoteClickk === true) {
          this.handleClientEvent();
        } else {
          document.removeEventListener('keydown', this.handleKeyDown.bind(this));
          document.removeEventListener('mouseup', this.mouseUpListener);
          document.removeEventListener('mousedown', this.mouseUpListener);
          document.removeEventListener('mousemove', this.mouseUpListener);
        }
      }
    });
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

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('mouseup', this.mouseUpListener);
    document.removeEventListener('mousedown', this.mouseUpListener);
    document.removeEventListener('mousemove', this.mouseUpListener);
    this.accelSubscription.unsubscribe();
    this.gyroSubscription.unsubscribe();
    this.accelIncludingGravitySubscription.unsubscribe();
    this.processedPointerSubscription.unsubscribe();
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
  private mouseUpListener = () => {
    this.isDragging = false;
  };

  private handleClientEvent(): void {
    document.getElementById('threejs-container')!.addEventListener('mousedown', (event) => {
      console.log('mousedown', event);
      this.isDragging = true;
      this.previousX = event.clientX;
      this.previousY = event.clientY;
      document.addEventListener('mouseup', this.mouseUpListener);
    });
    document.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        const deltaX = event.clientX - this.previousX;
        const deltaY = event.clientY - this.previousY;

       
        this.switchMode(this.currentMode, deltaX, deltaY);

        this.previousX = event.clientX;
        this.previousY = event.clientY;

      }
    });
    document.getElementById('threejs-container')!.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }
  switchMode(currentMode: any, deltaX: number, deltaY: number){
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
      console.log('No mode selected or unsupported mode');
  }

  return 
 
}
  setMode(mode: 'cubeRotation' | 'cubePosition' | 'sceneRotation' | 'scenePosition' | 'cameraRotation' | 'cameraPosition'): void {
    this.currentMode = mode;
    console.log(`Mode set to: ${mode}`);
  }
}
