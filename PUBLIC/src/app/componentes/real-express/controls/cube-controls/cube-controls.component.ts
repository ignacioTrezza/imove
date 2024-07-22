import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cube-controls',
  templateUrl: './cube-controls.component.html',
  styleUrls: ['./cube-controls.component.scss']
})
export class CubeControlsComponent {
  @Output() cubeAdded = new EventEmitter<any>();

  cubeX: number = 0;
  cubeY: number = 0;
  cubeZ: number = 0;
  cubeAmount: number = 1;
  cubeColor: string = '#ffffff';
  cubeTexture: string = 'basic';
  cubeSize: number = 1;

  addCube() {
    this.cubeAdded.emit({
      x: this.cubeX,
      y: this.cubeY,
      z: this.cubeZ,
      amount: this.cubeAmount,
      color: this.cubeColor,
      texture: this.cubeTexture,
      size: this.cubeSize
    });
  }
}