import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccelerometerDisplayComponent } from '../componentes/accelerometer-display/accelerometer-display.component';
import { AccelerometerIncludingGravityDisplayComponent } from '../componentes/gravity-display/accelerometer-including-gravity-display.component';
import { RealExpressComponent } from '../componentes/real-express/real-express.component';
import { GyroscopeDisplayComponent } from '../componentes/gyroscope-display/gyroscope-display.component';
import { MoveComponent } from './move.component';

@NgModule({
  declarations: [
    MoveComponent,
    AccelerometerDisplayComponent,
    AccelerometerIncludingGravityDisplayComponent,        
    RealExpressComponent,
    GyroscopeDisplayComponent
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
