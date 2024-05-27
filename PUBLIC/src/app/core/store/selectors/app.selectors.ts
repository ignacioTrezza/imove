import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FeatureState } from '../feature.state';

export const selectFeature = createFeatureSelector<AppState>('app');

export const selectToggleRemoteClick = createSelector(
  selectFeature,
  (state: AppState) => state.canvasHandling.remoteClick
);
export const selectToggleEventHandling = createSelector(
  selectFeature,
  (state: AppState) => state.canvasHandling.eventHandlingCanvas
);
export const selectToggleAccelerometer = createSelector(
  selectFeature,
  (state: AppState) => state.sensorHandling.accelerometer
);
export const selectToggleAccelerometerIncludingGravity = createSelector(
  selectFeature,
  (state: AppState) => state.sensorHandling.accelerometerIncludingGravity
);
export const selectToggleGyroscope = createSelector(
  selectFeature,
  (state: AppState) => state.sensorHandling.gyroscope
);
export const selectToggleClick = createSelector(
  selectFeature,
  (state: AppState) => state.sensorHandling.click
);
export const selectToggleMousePos = createSelector(
  selectFeature,
  (state: AppState) => state.sensorHandling.processedPointer
);
export const selectToggleClientEventHandling = createSelector(
  selectFeature,
  (state: AppState) => state.canvasHandling.showCanvas
);
export const selectSetMovementMode = createSelector(
  selectFeature,
  (state: AppState) => state.otherHandling.setMovementMode
);
export const selectFeatureState = createFeatureSelector<FeatureState>('featureKey');

export const selectFeatureItems = createSelector(
  selectFeatureState,
  (state: FeatureState) => state.items
);