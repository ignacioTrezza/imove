import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';
import { WebsocketService } from '../../../services/web-socket.service';
import { AppState } from '../app.state';


@Injectable()
export class AppEffects {
  toggleRemoteClick: boolean = true;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    public websocketService: WebsocketService
  ) {}

  toggleRemoteClick$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AppActions.toggleRemoteClickHandling),
      withLatestFrom(this.store.pipe(select(state => state.toggleRemoteClick))),
      tap(([action, toggleRemoteClickHandling]) => {
        // this.toggleRemoteClick = !toggleRemoteClickHandling;
        this.websocketService.toggleRemoteClick.emit(this.toggleRemoteClick);

      })
    ),
    { dispatch: false }
  );

  toggleEventHandling$ = createEffect(() => 
  this.actions$.pipe(
    ofType(AppActions.toggleEventHandling),
    withLatestFrom(this.store.pipe(select(state => state.toggleEventHandling))),
    tap(([action, toggleEventHandling]) => {
      // this.enableRemoteClick = !toggleRemoteClick;
      // this.websocketService.toggleEventHandling.emit(this.enableRemoteClick);

    })
  ),
  { dispatch: false }
);
toggleAccelerometerHandling$ = createEffect(() => 
this.actions$.pipe(
  ofType(AppActions.toggleAccelerometerHandling),
  withLatestFrom(this.store.pipe(select(state => state.toggleAccelerometer))),
  tap(([action, toggleAccelerometer]) => {
    // this.enableRemoteClick = !toggleRemoteClick;
    // this.websocketService.toggleEventHandling.emit(this.enableRemoteClick);

  })
),
{ dispatch: false }
);
handleAccelerometerIncludingGravity$ = createEffect(() => 
this.actions$.pipe(
  ofType(AppActions.toggleAccelerometerIncludingGravityHandling),
  withLatestFrom(this.store.pipe(select(state => state.toggleAccelerometerIncludingGravity))),
  tap(([action, toggleAccelerometerIncludingGravity]) => {
    // this.enableRemoteClick = !toggleRemoteClick;
    // this.websocketService.toggleEventHandling.emit(this.enableRemoteClick);

  })
),
{ dispatch: false }
);
handleGyroscope$ = createEffect(() => 
this.actions$.pipe(
  ofType(AppActions.toggleGyroscopeHandling),
  withLatestFrom(this.store.pipe(select(state => state.toggleGyroscope))),
  tap(([action, toggleGyroscope]) => {
    // this.enableRemoteClick = !toggleRemoteClick;
    // this.websocketService.toggleEventHandling.emit(this.enableRemoteClick);

  })
),
{ dispatch: false }
);
handleClick$ = createEffect(() => 
this.actions$.pipe(
  ofType(AppActions.toggleClickHandling),
  withLatestFrom(this.store.pipe(select(state => state.toggleClick))),
  tap(([action, toggleClick]) => {
    // this.enableRemoteClick = !toggleRemoteClick;
    // this.websocketService.toggleEventHandling.emit(this.enableRemoteClick);

  })
),
{ dispatch: false }
);

handleMousePos$ = createEffect(() => 
this.actions$.pipe(
  ofType(AppActions.toggleMousePosHandling),
  withLatestFrom(this.store.pipe(select(state => state.toggleMousePos))),
  tap(([action, toggleMousePos]) => {
    // this.enableRemoteClick = !toggleRemoteClick;
    // this.websocketService.toggleEventHandling.emit(this.enableRemoteClick);

  })
),
{ dispatch: false }
);
handleClientEvent$ = createEffect(() => 
this.actions$.pipe(
  ofType(AppActions.toggleClientEventHandling),
  withLatestFrom(this.store.pipe(select(state => state.toggleClientEventHandling))),
  tap(([action, toggleClientEventHandling]) => {
    // this.enableRemoteClick = !toggleRemoteClick;
    // this.websocketService.toggleEventHandling.emit(this.enableRemoteClick);

  })
),
{ dispatch: false }
);
setMovementMode$ = createEffect(() => 
this.actions$.pipe(
  ofType(AppActions.setMovementMode),
  withLatestFrom(this.store.pipe(select(state => state.setMovementMode))),
  tap(([action, setMovementMode]) => {
    // this.enableRemoteClick = !toggleRemoteClick;
    // this.websocketService.toggleEventHandling.emit(this.enableRemoteClick);

  })
),
{ dispatch: false }
);
}

