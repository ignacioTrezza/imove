import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  toggleRemoteClick: boolean;
  toggleEventHandling: boolean;
  toggleAccelerometer: boolean;
  toggleAccelerometerIncludingGravity: boolean;
  toggleGyroscope: boolean;
  toggleClick: boolean;
  toggleMousePos: boolean;
  // Assuming FeatureState is defined elsewhere as per instructions
  featureKey: any; // Temporarily changed to 'any' until FeatureState is defined
}
export interface SensorDataState {
    data: string; // Assuming the actual data type is a string
  }
// export const appReducers: ActionReducerMap<AppState> = {
//   sensorData: sensorDataReducer,
//   enableRemoteClick: enableRemoteClickReduce,
//   enableEventHandling: enableEventHandlingReduce,
//   handleAccelerometer: handleAccelerometerReduce,
//   // Assuming featureReducer is defined elsewhere as per instructions
//   featureKey: featureReducer, // Added as per Step 4 instructions
// };

