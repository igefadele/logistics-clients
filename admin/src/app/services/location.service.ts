/**
==============
LOCATION SERVICE
==============
*/

import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { OutgoingWsEventType, WsEventType } from '../../core/enums';
import { LocationChangedPayload } from '../../core/models/ws_events_models';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private webSocketService: WebSocketService) {}

  /** ==== START LOCATION UPDATES
   * Start fetching location every 20 seconds and send WebSocket event */

  startLocationUpdates(deliveryId: string) {
    this.sendLocationUpdate(deliveryId);
    setInterval(() => {
      this.sendLocationUpdate(deliveryId);
    }, 20000);
  }

  /** ==== SEND LOCATION UPDATE
   * Fetch location from browser and send location_changed websoekt event to server */

  private sendLocationUpdate(deliveryId: string) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const fetchedLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const locationEventPayload: LocationChangedPayload = {
          event: WsEventType.location_changed,
          delivery_id: deliveryId,
          location: fetchedLocation,
        };
        this.webSocketService.sendEvent(OutgoingWsEventType.location_changed, locationEventPayload);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
