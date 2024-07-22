export class EnvironmentEffects {
backgroundColor: string;
fogColor: string;
fogNear: number;
fogFar: number;

constructor() {
  this.backgroundColor = '#ffffff'; // Default white background
  this.fogColor = '#aaaaaa'; // Default light gray fog
  this.fogNear = 0.1; // Default start of fog
  this.fogFar = 100.0; // Default end of fog
}

updateEnvironment() {
  // Emit event or call service to update the environment
}
}