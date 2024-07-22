import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-material-properties',
  templateUrl: './material-properties.component.html',
  styleUrls: ['./material-properties.component.scss']
})
export class MaterialPropertiesComponent {
  @Output() materialChanged = new EventEmitter<any>();

  opacity: number = 1.0;
  wireframe: boolean = false;
  emissiveColor: string = '#000000';

  updateMaterial() {
    this.materialChanged.emit({
      opacity: this.opacity,
      wireframe: this.wireframe,
      emissiveColor: this.emissiveColor
    });
  }
}