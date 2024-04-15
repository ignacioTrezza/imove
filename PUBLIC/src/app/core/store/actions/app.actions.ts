import { createAction } from '@ngrx/store';
import { movementMode } from '../../interfaces/sensor.interfaces';
import { props } from '@ngrx/store';

export const toggleRemoteClickHandling = createAction('[App Component] Toggle Remote Click Handling');
export const toggleEventHandling = createAction('[App Component] Toggle Event Handling');
export const toggleAccelerometerHandling = createAction('[App Component] Toggle Accelerometer Handling');
export const toggleAccelerometerIncludingGravityHandling = createAction('[App Component] Handle Accelerometer Including Gravity');
export const toggleGyroscopeHandling = createAction('[App Component] Handle Gyroscope');
export const toggleClickHandling = createAction('[App Component] Handle Click');
export const toggleMousePosHandling = createAction('[App Component] Handle Mouse Pos');
export const toggleClientEventHandling = createAction('[App Component] Handle Client Event');
export const setMovementMode = createAction('[App Component] Set Movement Mode', props<{ mode: movementMode }>());


// export const handleMouseWheel = createAction('[App Component] Handle Mouse Wheel');
// export const handleMouseMove = createAction('[App Component] Handle Mouse Move');
// export const handleMouseDown = createAction('[App Component] Handle Mouse Down');
// export const handleMouseUp = createAction('[App Component] Handle Mouse Up');
// export const handleMouseEnter = createAction('[App Component] Handle Mouse Enter');
// export const handleMouseLeave = createAction('[App Component] Handle Mouse Leave');
// export const handleMouseOver = createAction('[App Component] Handle Mouse Over');
// export const handleMouseOut = createAction('[App Component] Handle Mouse Out');


