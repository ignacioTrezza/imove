import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccelerometerDisplayComponent } from '../componentes/accelerometer-display/accelerometer-display.component';
import { AccelerometerIncludingGravityDisplayComponent } from '../componentes/gravity-display/accelerometer-including-gravity-display.component';
import { RealExpressComponent } from '../componentes/real-express/real-express.component';
import { GyroscopeDisplayComponent } from '../componentes/gyroscope-display/gyroscope-display.component';
import { MoveComponent } from './move.component';
import { CubeAnimationComponent } from '../componentes/real-express/controls/cube-animation/cube-animation.component';
import { CubeControlsComponent } from '../componentes/real-express/controls/cube-controls/cube-controls.component';
import { CubeLightingComponent } from '../componentes/real-express/controls/cube-lighting/cube-lighting.component';
import { EnvironmentEffectsComponent } from '../componentes/real-express/controls/environment-effects/environment-effects.component';
import { GeneralControlsComponent } from '../componentes/real-express/controls/general-controls/general-controls.component';
import { MaterialPropertiesComponent } from '../componentes/real-express/controls/material-properties/material-properties.component';
import { GeometryModificationsComponent } from '../componentes/real-express/controls/geometry-modifications/geometry-modifications.component';

@NgModule({
  declarations: [
    MoveComponent,
    AccelerometerDisplayComponent,
    AccelerometerIncludingGravityDisplayComponent,        
    RealExpressComponent,
    GyroscopeDisplayComponent,
    GeneralControlsComponent,
    CubeControlsComponent,
    CubeAnimationComponent,
    EnvironmentEffectsComponent,
    CubeLightingComponent,
    MaterialPropertiesComponent,
    GeometryModificationsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    FormsModule,
  ],
  exports: [
    RealExpressComponent,        
    AccelerometerDisplayComponent,
    AccelerometerIncludingGravityDisplayComponent,
    GyroscopeDisplayComponent
  ],
  providers: [
    DecimalPipe
  ],
})
export class MoveModule { }
