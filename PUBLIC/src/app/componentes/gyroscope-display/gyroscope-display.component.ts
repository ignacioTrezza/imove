import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
@Component({

  selector: 'app-gyroscope-display',
  standalone: false,
  templateUrl: './gyroscope-display.component.html',
  styleUrl: './gyroscope-display.component.scss',
  
})
export class GyroscopeDisplayComponent  implements OnChanges {

  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() z: number = 0; // Assuming gyroscope also has x, y, z
  rotation: number = 0;
  tilt: number = 0; // Add tilt to represent rotation around z-axis
  constructor(private electronService: ElectronService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['x'] || changes['y'] || changes['z']) {
      // Implement rotation logic based on gyroscope data
      this.rotation = Math.atan2(this.y, this.x) * (180 / Math.PI);
      // this.electronService.electronAPI.moveCursorTo(500,700);
       // Calculate tilt as the angle in the XY plane from the Z-axis
       this.tilt = Math.atan2(Math.sqrt(this.x * this.x + this.y * this.y), this.z) * (180 / Math.PI);
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
