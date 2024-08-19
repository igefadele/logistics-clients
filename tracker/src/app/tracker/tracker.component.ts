/**
==============
TRACKER COMPONENT
==============
*/

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PackageService } from '../services/package.service';
import { DeliveryService } from '../services/delivery.service';
import { WebSocketService } from '../services/websocket.service';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IPackage } from '../../core/models/package.model';
import { IDelivery } from '../../core/models/delivery.model';
import { ILocation } from '../../core/models/location.model';
import { IncomingWsEventType, WsEventType } from '../../core/enums';
import { CURRENT_LOCATION } from '../../core/constants';
import { formatLocation } from '../../core/utils';

// Leaflet package marker icons
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;


@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css'],
})
export class TrackerComponent implements OnInit {
  packageId: string = '';
  packageDetails?: IPackage;
  deliveryDetails?: IDelivery;
  map: any;
  markers: { [key: string]: L.Marker } = {};
  errorMessage: string = '';
  formatLocation = formatLocation;

  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  /** ==== TRACK PACKAGE:
  Fetch package and delivery details */

  trackPackage() {
    this.packageDetails = undefined;
    this.errorMessage = '';

    if (!this.packageId) {
      this.errorMessage = 'No packageId provided';
      return;
    }

    this.packageService.getPackageById(this.packageId)
      .subscribe((packageResponse) => {
      if (packageResponse.data) {
        const packageData: IPackage = packageResponse.data as IPackage;
        this.packageDetails = packageData;
        if (this.map) {
          return;
        } else {
          this.initializeMap(packageData.from_location, packageData.to_location);
        }

        if (packageData.active_delivery_id) {
          this.deliveryService.getDeliveryById(packageData.active_delivery_id)
            .subscribe((deliveryResponse) => {
            if (deliveryResponse.data) {
              const deliveryData: IDelivery = deliveryResponse.data as IDelivery;
              this.deliveryDetails = deliveryData;
              this.updateMap(deliveryData.location);
              this.listenForUpdates(deliveryData.delivery_id);
              this.cdr.detectChanges();
            } else {
              this.errorMessage = 'No delivery data found for active delivery ID';
             }
          });
        } else {
          this.errorMessage = 'No active delivery ID associated with this package';
        }
      } else {
        this.errorMessage = 'No package data found for provided packageId';
       }
    });
  }


  /** ==== INITIALIZE MAP:
  Initialize the map and add markers for from_location and to_location */

  initializeMap(fromLocation: ILocation, toLocation: ILocation) {
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.addMarker(fromLocation, 'From Location', 'from_location');
    this.addMarker(toLocation, 'To Location', 'to_location');
  }


  /** ==== ADD MAP MARKER:
  Add a marker to the map and save it in the markers object */

  addMarker(location: ILocation, title: string, key: string) {
    const marker = L.marker([location.lat, location.lng]).addTo(this.map)
      .bindPopup(title)
      .openPopup();
    this.markers[key] = marker;
  }


  /** ==== UPDATE MAP:
  Update the map with the current delivery location */

  updateMap(location: ILocation) {
    if (this.markers[CURRENT_LOCATION]) {
      this.map.removeLayer(this.markers[CURRENT_LOCATION]);
    }

    const marker = L.marker([location.lat, location.lng]).addTo(this.map)
      .bindPopup('Current Location')
      .openPopup();

    this.markers[CURRENT_LOCATION] = marker;
    this.map.setView([location.lat, location.lng], 13);
  }


  /** ==== LISTEN FOR UPDATES
  Listen for WebSocket updates/events */

  listenForUpdates(deliveryId: string) {
    this.webSocketService.onEvent(IncomingWsEventType.delivery_updated)
      .subscribe((payload) => {
      if (payload.delivery_object.delivery_id === deliveryId) {
        this.deliveryDetails = payload.delivery_object;
        const currentLocation = payload.delivery_object.location;
        this.updateMap(currentLocation);
        this.cdr.detectChanges();
      }
    });
  }
}
