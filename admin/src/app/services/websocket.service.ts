/**
==============
WEBSOCKET SERVICE
==============
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { API_WS_BASE_URL } from '../../core/constants';
import { DeliveryIncomingEventPayload, DeliveryOutgoingEventPayload } from '../../core/models/ws_events_models';
import { IncomingWsEventType, OutgoingWsEventType } from '../../data/enums';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: Socket;

  constructor() {
    // Connect to the API WebSocket server
    this.socket = io(API_WS_BASE_URL);
  }

  /** ==== SEND EVENT:
   * Emit a websocket event to the server */
  sendEvent(event: OutgoingWsEventType, data: DeliveryOutgoingEventPayload) {
    this.socket.emit(event, data);
  }

  /** ==== ON EVENT:
   * Listen for events from the server */
  onEvent(event: IncomingWsEventType): Observable<DeliveryIncomingEventPayload> {
    return new Observable((observer) => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });
    });
  }

  /** ==== DISCONECT:
   * Disconnect the socket */
  disconnect() {
    this.socket.disconnect();
  }
}
