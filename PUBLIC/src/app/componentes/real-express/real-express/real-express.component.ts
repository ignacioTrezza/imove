import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../../services/web-socket.service';
import * as THREE from 'three';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-real-express',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './real-express.component.html',
  styleUrls: ['./real-express.component.scss']
})
export class RealExpressComponent implements OnInit, OnDestroy, AfterViewInit {
  private accelSubscription!: Subscription;
  private gyroSubscription!: Subscription;
  private accelIncludingGravitySubscription!: Subscription;
  private processedPointerSubscription!: Subscription;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry!: THREE.BoxGeometry;
  private material!: THREE.MeshBasicMaterial;
  private cube!: THREE.Mesh;

  private isDragging: boolean = false;
  private previousX: number = 0;
  private previousY: number = 0;
  public importedCubes: THREE.Mesh[]=[];

  constructor(private websocketService: WebsocketService) {}

  // @ViewChild(DataPointsComponent) dataPointsComponent!: DataPointsComponent;

  ngOnInit(): void {
    this.initThree();
    this.subscribeToData();
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
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
    document.getElementById('threejs-container')!.addEventListener('mousedown', (event) => {
      this.isDragging = true;
      this.previousX = event.clientX;
      this.previousY = event.clientY;
    });
    document.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        const deltaX = event.clientX - this.previousX;
        const deltaY = event.clientY - this.previousY;
        if (event.buttons === 1) {
          this.scene.rotation.y += deltaX * 0.005;
          this.scene.rotation.x += deltaY * 0.005;
        } else if (event.buttons === 2) {
          this.camera.position.x += deltaX * 0.01;
          this.camera.position.y -= deltaY * 0.01;
        }
        this.previousX = event.clientX;
        this.previousY = event.clientY;
      }
    });
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
    document.getElementById('threejs-container')!.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500);
    this.renderer = new THREE.WebGLRenderer();
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.position.y = Math.random()*10;
    this.cube.position.x = Math.random()*10;
    this.cube.position.z = Math.random()*10;
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = Math.random()*10;
      cube.position.x = Math.random()*10;
      cube.position.z = Math.random()*10;
      this.scene.add(cube);
    }
    this.scene.add(this.cube);
    this.camera.position.z = 100;
    const axisX = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const axisY = new THREE.Mesh(new THREE.BoxGeometry(0.1, 10, 0.1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const axisZ = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));

    axisX.position.set(5, 0, 0);
    axisY.position.set(0, 5, 0);
    axisZ.position.set(0, 0, 5);

    this.scene.add(axisX, axisY, axisZ);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  private subscribeToData(): void {
    this.accelIncludingGravitySubscription = this.websocketService.accelerometerIncludingGravityData.subscribe(data => {
      console.log('data:',data);
      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (error) {
        console.error('Error parsing accelerometerIncludingGravityData:', error);
        return;
      }
    
      const { x, y, z } = parsedData;
        console.log('XYZ:', x, y, z, this.cube.position.x , this.cube.position.y, this.cube.position.z);
    
      if (x !== null && y !== null && z !== null) {
        this.cube.position.x = this.cube.position.x + x;
        this.cube.position.y = this.cube.position.y + y;
        this.cube.position.z = this.cube.position.z + z/50;
      } else {
        console.log('XYZ:', x, y, z, this.cube.position.x , this.cube.position.y, this.cube.position.z);
      }
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    console.log(`Key pressed: ${event.key}`);
  }
}