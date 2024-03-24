import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { FeatureState } from '../feature.state';

export const selectFeature = createFeatureSelector<AppState>('app');

export const selectToggleRemoteClick = createSelector(
  selectFeature,
  (state: AppState) => state.toggleRemoteClick
);
export const selectToggleEventHandling = createSelector(
  selectFeature,
  (state: AppState) => state.toggleEventHandling
);
export const selectToggleAccelerometer = createSelector(
  selectFeature,
  (state: AppState) => state.toggleAccelerometer
);
export const selectToggleAccelerometerIncludingGravity = createSelector(
  selectFeature,
  (state: AppState) => state.toggleAccelerometerIncludingGravity
);
export const selectToggleGyroscope = createSelector(
  selectFeature,
  (state: AppState) => state.toggleGyroscope
);
export const selectToggleClick = createSelector(
  selectFeature,
  (state: AppState) => state.toggleClick
);
export const selectToggleMousePos = createSelector(
  selectFeature,
  (state: AppState) => state.toggleMousePos
);
export const selectFeatureState = createFeatureSelector<FeatureState>('featureKey');

export const selectFeatureItems = createSelector(
  selectFeatureState,
  (state: FeatureState) => state.items
);