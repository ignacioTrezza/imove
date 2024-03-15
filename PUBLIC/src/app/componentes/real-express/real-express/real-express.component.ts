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
    document.getElementById('threejs-container')!.appendChild(this.renderer.domElement);
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
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);
    this.camera.position.z = 5;
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  private subscribeToData(): void {
    this.accelSubscription = this.websocketService.accelerometerData.subscribe(data => {
      // Update Three.js object with accelData
    });

    this.gyroSubscription = this.websocketService.gyroscopeData.subscribe(data => {
      // Update Three.js object with gyroData
    });

    this.accelIncludingGravitySubscription = this.websocketService.accelerometerIncludingGravityData.subscribe(data => {
      // Update Three.js object with accelIncludingGravityData
    });

    this.processedPointerSubscription = this.websocketService.processedPointerData.subscribe(data => {
      // Update Three.js object with processedPointerData
    });
  }
}
