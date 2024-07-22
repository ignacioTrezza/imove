import { Component } from '@angular/core';
import { EnvironmentEffects } from '../model/environment-effects.model';

@Component({
  selector: 'app-environment-effects',
  templateUrl: './environment-effects.component.html',
  styleUrls: ['./environment-effects.component.scss']
})
export class EnvironmentEffectsComponent {
  model: EnvironmentEffects;

  constructor() {
    this.model = new EnvironmentEffects();
  }

  updateEnvironment() {
    this.model.updateEnvironment();
  }
}