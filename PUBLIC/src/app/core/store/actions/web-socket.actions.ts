import { createAction } from '@ngrx/store';
import { props } from '@ngrx/store';


export const connectWebSocket = createAction('[WebSocket] Connect');
export const disconnectWebSocket = createAction('[WebSocket] Disconnect');
export const webSocketConnected = createAction('[WebSocket] Connected');
export const webSocketDisconnected = createAction('[WebSocket] Disconnected');
export const receiveWebSocketData = createAction('[WebSocket] Data Received', props<{ data: any }>());

