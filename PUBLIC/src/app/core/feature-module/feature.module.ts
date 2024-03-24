// In your feature module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
  declarations: [
    // Your feature components
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([]), // Temporarily removed FeatureEffects due to unresolved reference
    StoreModule.forFeature('featureKey', {}), // Temporarily replaced featureReducer with an empty object due to unresolved reference
    
    // Other imports for the feature module
  ]
})
export class FeatureModule { }