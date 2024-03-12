import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/web-socket.service';
import { AccelerometerDisplayComponent } from '../accelerometer-display/accelerometer-display.component';
import { GyroscopeDisplayComponent } from '../gyroscope-display/gyroscope-display.component';

@Component({
  selector: 'app-another-subscriber',
  standalone: true,
  imports: [AccelerometerDisplayComponent, GyroscopeDisplayComponent], 
  templateUrl: './another-subscriber.component.html',
  styleUrls: ['./another-subscriber.component.scss'],
})
export class AnotherSubscriberComponent implements OnInit, OnDestroy {
  private accelSubscription!: Subscription;
  private gyroSubscription!: Subscription;
  public gyroAlpha: number = 0;
  public gyroBeta: number = 0;
  public gyroGamma: number = 0;

  public accelX: number = 0;
  public accelY: number = 0;
  public accelZ: number = 0;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.accelSubscription = this.websocketService.accelerometerData.subscribe(({ x, y, z }) => {
      console.log(`Accelerometer: x=${x}, y=${y}, z=${z}`);
      this.accelX = x;
      this.accelY = y;
      this.accelZ = z;
      // Handle accelerometer data
    });

    this.gyroSubscription = this.websocketService.gyroscopeData.subscribe(({ alpha, beta, gamma }) => {
      console.log(`Gyroscope: alpha=${alpha}, beta=${beta}, gamma=${gamma}`);
      this.gyroAlpha = alpha;
      this.gyroBeta = beta;
      this.gyroGamma = gamma;
      // Handle gyroscope data
    });
  }

  ngOnDestroy(): void {
    this.accelSubscription.unsubscribe();
    this.gyroSubscription.unsubscribe();
  }
}
