import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-geometry-modifications',
  templateUrl: './geometry-modifications.component.html',
  styleUrls: ['./geometry-modifications.component.scss']
})
export class GeometryModificationsComponent {
  @Output() geometryChanged = new EventEmitter<any>();

  segments: number = 32;
  scale: number = 1;

  updateGeometry() {
    this.geometryChanged.emit({
      segments: this.segments,
      scale: this.scale
    });
  }
}