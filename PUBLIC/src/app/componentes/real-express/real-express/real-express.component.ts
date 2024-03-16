import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../../services/web-socket.service';
import * as THREE from 'three';

@Component({
  selector: 'app-real-express',
  standalone: true,
  imports: [],
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

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.initThree();
    this.subscribeToData();
  }

  ngAfterViewInit(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container')!.append(this.renderer.domElement);
    this.animate();
  }

  ngOnDestroy(): void {
    this.accelSubscription.unsubscribe();
    this.gyroSubscription.unsubscribe();
    this.accelIncludingGravitySubscription.unsubscribe();
    this.processedPointerSubscription.unsubscribe();
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500);
    this.renderer = new THREE.WebGLRenderer();
    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);
    this.camera.position.z = 10; 
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  private subscribeToData(): void {
    // Other subscriptions remain unchanged

    this.accelIncludingGravitySubscription = this.websocketService.accelerometerIncludingGravityData.subscribe(data => {
      // Assuming 'data' might be a stringified JSON. If it's already an object, this step is unnecessary.
      console.log('data:',data);
      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (error) {
        console.error('Error parsing accelerometerIncludingGravityData:', error);
        return;
      }
    
      const { x, y, z } = parsedData;
      // this.cube.position.x = 1;
      //   this.cube.position.y = 1;
      //   this.cube.position.z = 1;
        console.log('XYZ:', x, y, z, this.cube.position.x , this.cube.position.y, this.cube.position.z);
    
      if (x !== null && y !== null && z !== null) {
        this.cube.position.x = Math.min(Math.max(this.cube.position.x, -20), 20);
        this.cube.position.y = Math.min(Math.max(this.cube.position.y, -20), 20);
        this.cube.position.z = Math.min(Math.max(this.cube.position.z, -20), 20);;
        // Adjust z if necessary, or you might not need to clamp z in a 2D plane
        this.cube.position.z = z;
      } else {
        this.cube.position.x = 0;
        this.cube.position.y = 0;
        this.cube.position.z = 0;
        console.log('XYZ:', x, y, z, this.cube.position.x , this.cube.position.y, this.cube.position.z);
      }
    });
  }
}
