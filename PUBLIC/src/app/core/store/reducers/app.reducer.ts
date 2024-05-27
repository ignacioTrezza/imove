import { createReducer, on, ActionReducer, MetaReducer } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';
import { AppState } from '../app.state';
import { environment } from '../../../environments/environmet';

export const initialState: AppState = {
  // featureKey: 'app',
  sensorHandling: {
    remoteClick: false,
    eventHandlingCanvas: false,
    accelerometer: false,
    accelerometerIncludingGravity: false,
    gyroscope: false,
    click: false,
    processedPointer: false,
  },
  canvasHandling: {
    remoteClick: false,
    eventHandlingCanvas: false,
    showCanvas: false,
  },
  otherHandling:{
    toggleEventHandling: false,
    toggleAccelerometer: false,
    toggleAccelerometerIncludingGravity: false,
    toggleGyroscope: false,
    toggleClick: false,
    toggleMousePos: false,
    setMovementMode: 'cubeRotation'
  },
  user: {
    id: 0,    
    username: '',
    email: '',
    origin: {},
    ownFeatures: [{ eventName: "", enviaOn: false, recibeOn: false }],
    availableFeatures: [{ eventName: "", enviaOn: false, recibeOn: false }]
  },
  websocket:{
    isConnected: false,
    data: {} // Assuming an empty object as default data
  }
  
};

export const appReducer = createReducer(
  initialState,
  on(AppActions.toggleRemoteClickHandling, (state) => ({ ...state, sensorHandling: {...state.sensorHandling, remoteClick: !state.sensorHandling.remoteClick}})),
  on(AppActions.toggleEventHandling, (state) => ({ ...state, sensorHandling: {...state.sensorHandling, eventHandlingCanvas: !state.sensorHandling.eventHandlingCanvas}})),
  on(AppActions.toggleAccelerometerHandling, (state) => ({ ...state, sensorHandling: {...state.sensorHandling, accelerometer: !state.sensorHandling.accelerometer}})),
  on(AppActions.toggleAccelerometerIncludingGravityHandling,(state) => ({ ...state, sensorHandling: {...state.sensorHandling, accelerometerIncludingGravity: !state.sensorHandling.accelerometerIncludingGravity}})),
  on(AppActions.toggleGyroscopeHandling,(state) =>({...state, sensorHandling: {...state.sensorHandling, gyroscope: !state.sensorHandling.gyroscope}})),
  on(AppActions.toggleClickHandling,(state) =>({...state, sensorHandling: {...state.sensorHandling, click: !state.sensorHandling.click}})),
  on(AppActions.toggleMousePosHandling,(state) =>({...state, sensorHandling: {...state.sensorHandling, processedPointer: !state.sensorHandling.processedPointer}})),
  on(AppActions.toggleClientEventHandling,(state) =>({...state, canvasHandling: {...state.canvasHandling, showCanvas: !state.canvasHandling.showCanvas}})),
  on(AppActions.setMovementMode, (state, { mode }) => ({
    ...state, 
    otherHandling: {
      ...state.otherHandling,
      setMovementMode: mode ?? 'defaultMode' // Ensuring it updates the correct nested property
    }
  })),
  on(AppActions.toggleAccelerometerHandling, (state) => ({
    ...state, 
    otherHandling: {
      ...state.otherHandling,
      toggleAccelerometer: !state.otherHandling.toggleAccelerometer
    }
  })),
  on(AppActions.toggleAccelerometerIncludingGravityHandling, (state) => ({
    ...state, 
    otherHandling: {
      ...state.otherHandling,
      toggleAccelerometerIncludingGravity: !state.otherHandling.toggleAccelerometerIncludingGravity
    }
  })),
  on(AppActions.toggleGyroscopeHandling, (state) => ({
    ...state, 
    otherHandling: {
      ...state.otherHandling,
      toggleGyroscope: !state.otherHandling.toggleGyroscope
    }
  })),
  on(AppActions.toggleClickHandling, (state) => ({
    ...state, 
    otherHandling: {
      ...state.otherHandling,
      toggleClick: !state.otherHandling.toggleClick
    }
  })),
  on(AppActions.toggleMousePosHandling, (state) => ({
    ...state, 
    otherHandling: {
      ...state.otherHandling,
      toggleMousePos: !state.otherHandling.toggleMousePos
    }
  }))

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
