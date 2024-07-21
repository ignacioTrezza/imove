import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../services/web-socket.service';
import * as THREE from 'three';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { ElectronService } from '../../services/electron.service';
import * as AppSelectors from '../../core/store/selectors/app.selectors';
import { movementMode } from '../../core/interfaces/sensor.interfaces';
import * as AppActions from '../../core/store/actions/app.actions';
import { signal } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-real-express',
  standalone: false,
  templateUrl: './real-express.component.html',
  styleUrls: ['./real-express.component.scss']
})
export class RealExpressComponent implements OnInit, OnDestroy, AfterViewInit {

  currentMode: 'cubeRotation' | 'cubePosition' | 'sceneRotation' | 'scenePosition' | 'cameraRotation' | 'cameraPosition' | null = 'cubeRotation';
  private boundHandleKeyDown: any;
  private prevAccelIncludingGravityX: number = 0;
  private prevAccelIncludingGravityY: number = 0;
  private prevAccelIncludingGravityZ: number = 0;

  private prevAccelerationX: number = 0;
  private prevAccelerationY: number = 0;
  private prevAccelerationZ: number = 0;

  private prevGyroscopeAlpha: number = 0;
  private prevGyroscopeBeta: number = 0;
  private prevGyroscopeGamma: number = 0;

  public gyroAlpha: number = 0;
  public gyroBeta: number = 0;
  public gyroGamma: number = 0;

  toggleRemoteClick: boolean = false;
  toggleEventHandling: boolean = false;
  toggleAccelerometer: boolean = false;
  toggleAccelerometerIncludingGravity: boolean = false;
  toggleGyroscope: boolean = false;
  toggleClick: boolean = false;
  toggleMousePos: boolean = false;
  toggleClientEventHandling: boolean = false

  // Corrected signal subscriptions

  public accelX = this.websocketService.accelerometerDataSignal;
  public accelY = this.websocketService.accelerometerDataSignal;
  public accelZ = this.websocketService.accelerometerDataSignal;

  public accelIncludingGravityX = this.websocketService.accelerometerIncludingGravityDataSignal;
  public accelIncludingGravityY = this.websocketService.accelerometerIncludingGravityDataSignal;
  public accelIncludingGravityZ = this.websocketService.accelerometerIncludingGravityDataSignal;

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
    private electronService: ElectronService,
    private zone: NgZone
  ) {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    // Bind methods once in the constructor
    this.mouseDownListener = this.mouseDownListener.bind(this);
    this.mouseMoveListener = this.mouseMoveListener.bind(this);
    this.mouseUpListener = this.mouseUpListener.bind(this);
  }

  ngOnInit(): void {
    this.initThree();
    this.initializeStoreEvents();
    this.subscribeToGyroscopeData();
    document.addEventListener('keydown', this.boundHandleKeyDown)
  }

  private subscribeToGyroscopeData(): void {
    this.websocketService.gyroscopeData$.subscribe(({ alpha, beta, gamma }) => {
    console.log('Gyroscope',` data: alpha=${alpha}, beta=${beta}, gamma=${gamma}`);
    this.prevGyroscopeAlpha = alpha;
    this.prevGyroscopeBeta = beta;
    this.prevGyroscopeGamma = gamma;
    this.updateObjectRotation(alpha, beta, gamma);
    });
    }

  private updateObjectRotation(alpha: number, beta: number, gamma: number): void {
    this.cube.rotation.x = alpha*(Math.PI / 180); 
    this.cube.rotation.y = beta * (Math.PI / 180); 
    this.cube.rotation.z = gamma * (Math.PI / 180);
  }

  initializeStoreEvents() {
    if (this.electronService.isElectron) {

      this.store.pipe(select(AppSelectors.selectToggleRemoteClick)).subscribe(toggleRemoteClick => {
        this.toggleRemoteClick = toggleRemoteClick;
        this.handleClientEvent(this.toggleRemoteClick);
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

      this.store.pipe(select(AppSelectors.selectToggleClientEventHandling)).subscribe(toggleClientEventHandling => {
        this.toggleClientEventHandling = toggleClientEventHandling;
      });
      this.store.pipe(select(AppSelectors.selectSetMovementMode)).subscribe(setMovementMode => {
        this.currentMode = setMovementMode as 'cubeRotation' | 'cubePosition' | 'sceneRotation' | 'scenePosition' | 'cameraRotation' | 'cameraPosition' | null;
      });
    }
  
  }
  
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
    document.removeEventListener('keydown', this.boundHandleKeyDown);
   

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
    this.camera.position.z = 10;
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
    const container = document.getElementById('threejs-container');
    if (status) {
        console.log('REMOTE CLICK ACTIVADO');
        container?.addEventListener('mousedown', this.mouseDownListener);
        document.addEventListener('mousemove', this.mouseMoveListener);
        document.addEventListener('mouseup', this.mouseUpListener);
        container?.addEventListener('contextmenu', event => event.preventDefault());
    } else {
        console.log('REMOTE CLICK DESACTIVADO');
        container?.removeEventListener('mousedown', this.mouseDownListener);
        document.removeEventListener('mousemove', this.mouseMoveListener);
        document.removeEventListener('mouseup', this.mouseUpListener);
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
        this.scene.position.y -= deltaY * 0.01;
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
  }
  setMode(mode: movementMode): void {
    this.currentMode = mode;
    console.log(`Mode set to: ${mode}`);
  }
}