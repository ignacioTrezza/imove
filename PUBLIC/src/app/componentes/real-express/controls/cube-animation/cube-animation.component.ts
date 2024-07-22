import { Component } from '@angular/core';
import { CubeAnimation } from '../model/cube-animation.model';

@Component({
  selector: 'app-cube-animation',
  templateUrl: './cube-animation.component.html',
  styleUrls: ['./cube-animation.component.scss']
})
export class CubeAnimationComponent {
  rotationSpeed: number;
  model: CubeAnimation;
  
  constructor() {
    this.rotationSpeed = 1.0; // Default rotation speed
    this.model = new CubeAnimation();
  }

  updateAnimation() {
    this.model.updateAnimation();
  }
}