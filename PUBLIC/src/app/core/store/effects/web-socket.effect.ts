
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import * as WebSocketActions from '../actions/web-socket.actions';
import { WebsocketService } from '../../../services/web-socket.service';


@Injectable()
export class WebSocketEffects {
  constructor(
    private actions$: Actions, 
    private websocketService: WebsocketService
    ) {}

  connectWebSocket$ = createEffect(() => this.actions$.pipe(
    ofType(WebSocketActions.connectWebSocket),
    tap(() => this.websocketService.connect('ws://example.com'))
  ), { dispatch: false });

  disconnectWebSocket$ = createEffect(() => this.actions$.pipe(
    ofType(WebSocketActions.disconnectWebSocket),
    tap(() => this.websocketService.disconnect())
  ), { dispatch: false });
  }