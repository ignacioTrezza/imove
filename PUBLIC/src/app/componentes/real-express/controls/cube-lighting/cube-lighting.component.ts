import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cube-lighting',
  templateUrl: './cube-lighting.component.html',
  styleUrl: './cube-lighting.component.scss'
})
export class CubeLightingComponent {
  @Output() lightingChanged = new EventEmitter<any>();

  intensity: number = 1;
  color: string = '#ffffff';

  updateLighting() {
    this.lightingChanged.emit({
      intensity: this.intensity,
      color: this.color
    });
  }
}