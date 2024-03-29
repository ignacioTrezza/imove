// Interface for Accelerometer message
interface AccelerometerMessage {
  tipo: string;
  x?: number;
  y?: number;
  z?: number;
}


// Interface for Gyroscope message
interface GyroscopeMessage {
  tipo: string;
  alpha?: number;
  beta?: number;
  gamma?: number;
}
export type movementMode = 'cubeRotation' | 'cubePosition' | 'sceneRotation' | 'scenePosition' | 'cameraRotation' | 'cameraPosition' | null;


export type SensorMessage = AccelerometerMessage | GyroscopeMessage;
