import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-accelerometer-including-gravity-display',
  standalone: false,
  // imports: [CommonModule],
  providers: [DecimalPipe],
  templateUrl: './accelerometer-including-gravity-display.component.html',
  styleUrls: ['./accelerometer-including-gravity-display.component.scss']
})
export class AccelerometerIncludingGravityDisplayComponent implements OnInit {
  @Input() x: number = 500;
  @Input() y: number = 500;
  @Input() z: number = 0;
  newX:number=0;
  newY:number = 0;
rotation: number = 0;
  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['x'] || changes['y'] || changes['z']) {
      // const pos = this.electronService.electronAPI.getMousePos();
      // this.moveCursorBasedOnAcceleration(pos.x, pos.y);
    }
  }

  // moveCursorBasedOnAcceleration(currentX: number, currentY: number): void {
  //   // Normalize acceleration data to a range that suits your screen size and preferences
  //   const sensitivity = 10; // Adjust this based on your needs
  //   let deltaX = this.x * sensitivity;
  //   let deltaY = this.y * sensitivity;

  //   // Calculate new position
  //   this.newX = currentX + deltaX;
  //   this.newY = currentY - deltaY; // Subtract deltaY because screen coordinates in Y are inverted

  //   // Boundary checks (assuming screen resolution of 1920x1080, adjust as needed)
  //   this.newX = Math.max(0, Math.min(this.newX, 1920));
  //   this.newY = Math.max(0, Math.min(this.newY, 1080));
  //   // this.rotation = newX;
  //   // Move the cursor to the new position
  //   // this.electronService.electronAPI.moveCursorTo(newX, newY);
  // }
  getFillColor(x: number): string {
    // This is a simplistic example. You might want to create a more
    // sophisticated function to map tilt values to colors.
    if (x < 45) return 'red';
    else if (x < 90) return 'yellow';
    else return 'green';
  }
}
