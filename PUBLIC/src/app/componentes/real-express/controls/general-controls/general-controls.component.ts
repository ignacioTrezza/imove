import { Component, EventEmitter, Output } from '@angular/core';
import { movementMode } from '../../../../core/interfaces/sensor.interfaces';

@Component({
  selector: 'app-general-controls',
  templateUrl: './general-controls.component.html',
  styleUrl: './general-controls.component.scss'
})
export class GeneralControlsComponent {
  @Output() modeChanged = new EventEmitter<movementMode>();

  setMode(mode: movementMode) {
    this.modeChanged.emit(mode);
  }
}
