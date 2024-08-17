import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    // Connect to the WebSocket server
    this.socket = io('http://localhost:3000');
  }

  // Emit an event to the server
  sendEvent(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // Listen for events from the server
  onEvent(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });
    });
  }

  // Disconnect the socket
  disconnect() {
    this.socket.disconnect();
  }
}
