import { createReducer, on, ActionReducer, MetaReducer } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';
import { AppState } from '../app.state';
import { environment } from '../../../environments/environmet';

export const initialState: AppState = {
  featureKey: 'app',
  toggleRemoteClick: false,
  toggleEventHandling: false,
  toggleAccelerometer: false,
  toggleAccelerometerIncludingGravity: false,
  toggleGyroscope: false,
  toggleClick: false,
  toggleMousePos: false,
  // Initialize other flags as needed
};

export const appReducer = createReducer(
  initialState,
  on(AppActions.toggleRemoteClickHandling, (state) => ({ ...state, toggleRemoteClick: !state.toggleRemoteClick })),
  on(AppActions.toggleEventHandling, (state) => ({ ...state, toggleEventHandling: !state.toggleEventHandling })),
  on(AppActions.toggleAccelerometerHandling, (state) => ({ ...state, toggleAccelerometer: !state.toggleAccelerometer })),
  on(AppActions.toggleAccelerometerIncludingGravityHandling,(state) =>({...state, toggleAccelerometerIncludingGravity: !state.toggleAccelerometerIncludingGravity})),
  on(AppActions.toggleGyroscopeHandling,(state) =>({...state, toggleGyroscope: !state.toggleGyroscope})),
  on(AppActions.toggleClickHandling,(state) =>({...state, toggleClick: !state.toggleClick})),
  on(AppActions.toggleMousePosHandling,(state) =>({...state, toggleMousePos: !state.toggleMousePos}))
  // Handle other toggle actions as needed
);

// Example metaReducer
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = !environment.production ? [debug] : [];
