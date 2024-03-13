import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/web-socket.service';
import { ElectronService } from '../../services/electron.service';
import { AccelerometerDisplayComponent } from '../accelerometer-display/accelerometer-display.component';
import { AccelerometerIncludingGravityDisplayComponent } from '../gravity-display/accelerometer-including-gravity-display.component';
import { GyroscopeDisplayComponent } from '../gyroscope-display/gyroscope-display.component';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-another-subscriber',
  standalone: true,
  imports: [AccelerometerDisplayComponent,AccelerometerIncludingGravityDisplayComponent,GyroscopeDisplayComponent, CommonModule], 
  providers: [DecimalPipe],
  templateUrl: './another-subscriber.component.html',
  styleUrls: ['./another-subscriber.component.scss'],
})
export class AnotherSubscriberComponent implements OnInit, OnDestroy {
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
  constructor(private websocketService: WebsocketService, private electronService: ElectronService) {}

  ngOnInit(): void {
    this.accelSubscription = this.websocketService.accelerometerData.subscribe(({ x, y, z }) => {
      console.log(`Accelerometer: x=${x}, y=${y}, z=${z}`);
      this.accelX = x;
      this.accelY = y;
      this.accelZ = z;
      // Handle accelerometer data
    });

    this.processedPointerSubscription= this.websocketService.processedPointerData.subscribe(({ x, y, z }) => {
      console.log(`Processed Pointer: x=${x}, y=${y}, z=${z}`);
      this.newX = x;
      this.newY = y;
      this.newZ = z;
      // Handle processed pointer data
    });
    this.gyroSubscription = this.websocketService.gyroscopeData.subscribe(({ alpha, beta, gamma }) => {
      console.log(`Gyroscope: alpha=${alpha}, beta=${beta}, gamma=${gamma}`);
      this.gyroAlpha = alpha;
      this.gyroBeta = beta;
      this.gyroGamma = gamma;
      // Handle gyroscope data
    });

    this.accelIncludingGravitySubscription = this.websocketService.accelerometerIncludingGravityData.subscribe(({ x, y, z }) => {
      console.log(`Accelerometer Including Gravity: x=${x}, y=${y}, z=${z}`);
      this.accelIncludingGravityX = x;
      this.accelIncludingGravityY = y;
      this.accelIncludingGravityZ = z;
   

    })
  }
    // Combine all subscriptions to call updateMousePosition
    // this.gyroSubscription;
    // this.accelIncludingGravitySubscription;
    // this.accelSubscription;
   
      // this.websocketService.messages$.subscribe(() => {
      //   this.updateMousePosition();
      // })
    
  
  moveCursorBasedOnAcceleration(currentX: number, currentY: number, x:number, y:number, z:number): void {
    // Normalize acceleration data to a range that suits your screen size and preferences
    const sensitivity = 10; // Adjust this based on your needs
    let deltaX = x * sensitivity;
    let deltaY = y * sensitivity;

    // Calculate new position
    this.newX = currentX + deltaX;
    this.newY = currentY - deltaY; // Subtract deltaY because screen coordinates in Y are inverted
this.newZ = 0;
    // Boundary checks (assuming screen resolution of 1920x1080, adjust as needed)
    this.newX = Math.max(0, Math.min(this.newX, 1920));
    this.newY = Math.max(0, Math.min(this.newY, 1080));
      // Handle accelerometer including gravity data
      this.websocketService.emitProcessedPointerData(this.newX, this.newY, this.newZ);
    };
  // updateMousePosition(): void {
  //   // Adjust these based on experimentation
  //   const sensitivityMultiplier = 100; // Increase for more sensitivity
  //   const smoothingFactor = 0.8; // Between 0 and 1, higher for more smoothing

  //   // Apply sensitivity and smoothing
  //   this.newX = (this.newX * smoothingFactor) + ((this.accelX * sensitivityMultiplier + this.gyroAlpha) * (1 - smoothingFactor));
  //   this.newY = (this.newY * smoothingFactor) + ((this.accelY * sensitivityMultiplier + this.gyroBeta) * (1 - smoothingFactor));

  //   // Boundary checks
  //   this.newX = Math.max(0, Math.min(this.newX, 1920));
  //   this.newY = Math.max(0, Math.min(this.newY, 1080));

  //   this.websocketService.emitProcessedPointerData(this.newX, this.newY, this.newZ);
  //   // Move the cursor
  //   this.electronService.electronAPI.moveCursorTo(this.newX, this.newY);
  // }

  ngOnDestroy(): void {
    this.accelSubscription.unsubscribe();
    this.gyroSubscription.unsubscribe();
    this.accelIncludingGravitySubscription.unsubscribe();
    this.processedPointerSubscription.unsubscribe();
  }
}
