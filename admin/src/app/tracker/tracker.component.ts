/**
==============
TRACKER COMPONENT
==============
*/

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PackageService } from '../../data/services/package.service';
import { DeliveryService } from '../../data/services/delivery.service';
import { WebSocketService } from '../../data/services/websocket.service';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IPackage } from '../../data/models/package.model';
import { IDelivery } from '../../data/models/delivery.model';
import { ILocation } from '../../data/models/location.model';
import { DeliveryStatus, EntityKey, IncomingWsEventType, OutgoingWsEventType, SavedDataKey, WsEventType } from '../../data/enums';
import { CURRENT_LOCATION, CURRENT_LOCATION_TITLE, FROM_LOCATION, FROM_LOCATION_TITLE, MAP, OK, ROUTE_CREATE_DELIVERY, ROUTE_CREATE_PACKAGE, ROUTE_DELIVERY_DETAIL, ROUTE_PACKAGE_DETAIL, TO_LOCATION, TO_LOCATION_TITLE } from '../../core/constants';
import { formatLocation } from '../../core/utils';
import { LocationService } from '../../data/services/location.service';
import { StatusChangedPayload } from '../../data/models/ws_events_models';
import { Router, NavigationExtras } from '@angular/router';
import { DatastoreService } from '../../data/services/datastore.service';

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
  deliveryId: string = '';
  packageDetails?: IPackage;
  deliveryDetails?: IDelivery;
  map: any;
  markers: { [key: string]: L.Marker } = {};
  errorMessage: string = '';
  successMessage: string = '';
  formatLocation = formatLocation;
  status = DeliveryStatus;
  newPackageData?: IPackage;
  newDeliveryData?: IDelivery;
  packageList: IPackage[] = []
  deliveryList: IDelivery[] = [];

  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private datastoreService: DatastoreService,
  ) { }

  ngOnInit(): void {
    this.getAllPackages();
    this.getAllDeliveries();
  }


  /** ==== TRACK PACKAGE:
  Fetch package and delivery details */

  trackDelivery() {
    this.errorMessage = '';

    if (!this.deliveryId) {
      this.errorMessage = 'No deliveryId provided';
      return;
    }
    this.locationService.startLocationUpdates(this.deliveryId);

    this.deliveryService.getDeliveryById(this.deliveryId)
      .subscribe((deliveryResponse) => {
        if (deliveryResponse.data) {
          const deliveryData: IDelivery = deliveryResponse.data as IDelivery;
          this.deliveryDetails = deliveryData;
          this.listenForUpdates(deliveryData.delivery_id);
          this.cdr.detectChanges();
          if (this.map) {
            return;
          } else {
            this.initializeMap(deliveryData.location);
          }

          if (deliveryData.package_id) {
            this.packageService.getPackageById(deliveryData.package_id)
              .subscribe((packageResponse) => {
                if (packageResponse.data) {
                  const packageData: IPackage = packageResponse.data as IPackage;
                  this.packageDetails = packageData;
                  this.updateMap({location: packageData.from_location, title: FROM_LOCATION_TITLE, key: FROM_LOCATION});
                  this.updateMap({location: packageData.to_location, title: TO_LOCATION_TITLE, key: TO_LOCATION});
                  this.cdr.detectChanges();
                } else {
                  this.errorMessage = 'No package data found for the package ID';
                }
              });
          } else {
            this.errorMessage = 'No package ID associated with this delivery';
          }
        } else {
          this.errorMessage = 'No delivery data found for provided deliveryId';
        }
      });
    console.log('errorMessage: ', this.errorMessage);
  }


  /** ==== INITIALIZE MAP:
  Initialize the map and add markers for from_location and to_location */

  initializeMap(currentLocation: ILocation) {
    this.map = L.map(MAP).setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.addMarker({location: currentLocation, title: CURRENT_LOCATION_TITLE, key: CURRENT_LOCATION});
  }


  /** ==== ADD MAP MARKER:
  Add a marker to the map and save it in the markers object */

  addMarker(data: {location: ILocation, title: string, key: string}) {
    const marker = L.marker([data.location.lat, data.location.lng]).addTo(this.map)
      .bindPopup(data.title)
      .openPopup();
    this.markers[data.key] = marker;
  }


  /** ==== UPDATE MAP:
  Update the map with the current delivery location */

  updateMap(data: {location: ILocation, title: string, key: string}) {
    if (this.markers[data.key]) {
      this.map.removeLayer(this.markers[data.key]);
    }

    const marker = L.marker([data.location.lat, data.location.lng]).addTo(this.map)
      .bindPopup(data.title)
      .openPopup();

    this.markers[data.key] = marker;
    this.map.setView([data.location.lat, data.location.lng], 13);
  }


  /** ==== LISTEN FOR UPDATES:
  Listen for WebSocket updates/events */

  listenForUpdates(deliveryId: string) {
    this.webSocketService.onEvent(IncomingWsEventType.delivery_updated)
      .subscribe((payload) => {
      if (payload.delivery_object.delivery_id === deliveryId) {
        this.deliveryDetails = payload.delivery_object;
        const currentLocation = payload.delivery_object.location;
        this.updateMap({location: currentLocation, title: CURRENT_LOCATION_TITLE, key: CURRENT_LOCATION});
        this.cdr.detectChanges();
      }
    });
  }

    /** ==== CHANGE DELIVERY STATUS:
  Send delivery status change WebSocket updates/events to server */
  changeStatus(status: DeliveryStatus) {
    this.errorMessage = '';
    if (!this.deliveryId) {
      this.errorMessage = 'No deliveryId provided';
      return;
    }
    const statusEventPayload: StatusChangedPayload = {
      event: WsEventType.status_changed,
      delivery_id: this.deliveryId,
      status: status,
    }
    this.webSocketService.sendEvent(OutgoingWsEventType.status_changed, statusEventPayload);
  }


  /** ==== GET ALL PACKAGES:
  * Fetch all packages from the server */

  getAllPackages() {
    this.packageService.getAll().subscribe((response) => {
      if (response.data) {
        const list = response.data;
        this.packageList = response.data as IPackage[];
        this.datastoreService.setObsData(SavedDataKey.packageList, this.packageList);
      }
    });
  }


  /** ==== GET ALL DELIVERIES:
  * Fetch all deliveries from the server */

  getAllDeliveries() {
    this.deliveryService.getAll().subscribe((response) => {
      if (response.data) {
        const list = response.data;
        this.deliveryList = response.data as IDelivery[];
        this.datastoreService.setObsData(SavedDataKey.deliveryList, this.deliveryList);
      }
    });
  }

  /** ==== VIEW PACKAGE DETAIL ROUTE: */
  viewPackageDetail(packageData: IPackage) {
    this.packageDetails = packageData;
    this.datastoreService.setObsData(SavedDataKey.package, this.packageDetails);
    this.router.navigate([ROUTE_PACKAGE_DETAIL, packageData.package_id]);
  }

  /** ==== VIEW DELIVERY DETAIL ROUTE: */
  viewDeliveryDetail(deliveryData: IDelivery) {
    this.deliveryDetails = deliveryData;
    this.datastoreService.setObsData(SavedDataKey.delivery, this.deliveryDetails);
    this.router.navigate([ROUTE_DELIVERY_DETAIL, deliveryData.delivery_id]);
  }

  /** ==== VIEW CREATE PACKAGE ROUTE: */
  viewCreatePackage() {
    this.router.navigate([ROUTE_CREATE_PACKAGE]);
  }

  /** ==== VIEW CREATE DELIVERY ROUTE: */
  viewCreateDelivery() {
    this.router.navigate([ROUTE_CREATE_DELIVERY]);
  }
}
