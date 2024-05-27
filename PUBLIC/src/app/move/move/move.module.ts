import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccelerometerDisplayComponent } from '../../componentes/accelerometer-display/accelerometer-display.component';
import { AccelerometerIncludingGravityDisplayComponent } from '../../componentes/gravity-display/accelerometer-including-gravity-display.component';
import { RealExpressComponent } from '../../componentes/real-express/real-express.component';
import { GyroscopeDisplayComponent } from '../../componentes/gyroscope-display/gyroscope-display.component';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { appReducer, metaReducers } from '../../core/store/reducers/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from '../../core/store/effects/app.effect';
import { MoveRoutingModule } from './move-routing.module';
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
    MoveRoutingModule,
    BrowserModule,   
    
    ReactiveFormsModule, 
    FormsModule
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
