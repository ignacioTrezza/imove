
import { movementMode } from '../interfaces/sensor.interfaces';

export interface AppState {
  toggleRemoteClick: boolean;
  toggleEventHandling: boolean;
  toggleAccelerometer: boolean;
  toggleAccelerometerIncludingGravity: boolean;
  toggleGyroscope: boolean;
  toggleClick: boolean;
  toggleMousePos: boolean;
  toggleClientEventHandling: boolean;
  setMovementMode: movementMode;
 
  featureKey: any; 
}
export interface SensorDataState {
    data: string;
  }
