import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-accelerometer-display',
  standalone: false,
  // imports: [CommonModule],
  templateUrl: './accelerometer-display.component.html',
  styleUrls: ['./accelerometer-display.component.scss'],
  providers: [DecimalPipe]
})
export class AccelerometerDisplayComponent implements OnChanges {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() z: number = 0; // Add z-axis input
  rotation: number = 0;
  tilt: number = 0; // Add tilt to represent rotation around z-axis
  constructor(private electronService: ElectronService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['x'] || changes['y'] || changes['z']) {
      // Update logic to incorporate z-axis
      this.rotation = Math.atan2(this.y, this.x) * (180 / Math.PI);
      // Calculate tilt as the angle in the XY plane from the Z-axis
      this.tilt = Math.atan2(Math.sqrt(this.x * this.x + this.y * this.y), this.z) * (180 / Math.PI);
      // this.electronService.electronAPI.moveCursorTo(200, 300);
    }
  }
  getFillColor(tilt: number): string {
    // This is a simplistic example. You might want to create a more
    // sophisticated function to map tilt values to colors.
    if (tilt < 45) return 'red';
    else if (tilt < 90) return 'yellow';
    else return 'green';
  }
}
