import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPackage } from '../../data/models/package.model';
import { IDelivery } from '../../data/models/delivery.model';
import { formatLocation } from '../../core/utils';
import { CURRENT_LOCATION, CURRENT_LOCATION_TITLE, MAP, OK, ROUTE_EDIT_DELIVERY } from '../../core/constants';
import { DeliveryService } from '../../data/services/delivery.service';
import { LocationService } from '../../data/services/location.service';
import { PackageService } from '../../data/services/package.service';
import { WebSocketService } from '../../data/services/websocket.service';
import { CommonModule } from '@angular/common';
import { DatastoreService } from '../../data/services/datastore.service';
import * as L from 'leaflet';
import { ILocation } from '../../data/models/location.model';

@Component({
  selector: 'app-delivery-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-detail.component.html',
  styleUrl: './delivery-detail.component.css'
})
export class DeliveryDetailComponent implements OnInit {
  deliveryId: string = '';
  packageId: string = '';
  deliveryDetails?: IDelivery | null;
  errorMessage: string = '';
  successMessage: string = '';
  formatLocation = formatLocation;
  map: any;
  markers: { [key: string]: L.Marker } = {};

  constructor(
    private router: Router,
    private deliveryService: DeliveryService,
    private route: ActivatedRoute,
    private datastoreService: DatastoreService,
  ) {}

  ngOnInit(): void {
    this.getRouteIdParam();
    this.getDelivery(this.deliveryId);
  }

  /** ==== GET PACKAGE ROUTE ID PARAM:
  * Get the /:id param value from the route */

  getRouteIdParam(): string | null {
    const deliveryId = this.route.snapshot.paramMap.get('id');
    if (deliveryId) {
      this.deliveryId = deliveryId;
      return deliveryId;
    }
    return null
  }

  /** ==== GET DELIVERY:
  * Get delivery data from server using its ID */

  getDelivery(deliveryId: string) {
    this.deliveryService.getDeliveryById(deliveryId).subscribe((response) => {
      this.deliveryDetails = response.data as IDelivery;
      this.initializeMap(this.deliveryDetails.location);
    });
  }

  /** ==== VIEW EDIT DELIVERY ROUTE: */
  viewEditDelivery() {
    this.router.navigate([ROUTE_EDIT_DELIVERY, this.deliveryId]);
  }

  /** ==== UPDATE DELIVERY:
  * Update a delivery document on the server */

  updateDelivery() {
    this.errorMessage = '';
    if (!this.deliveryDetails) {
      this.errorMessage = 'No new delivery data provided';
      return;
    }

    this.deliveryService.update(this.deliveryDetails)
      .subscribe((response) => {
        if (response.code === OK) {
          this.successMessage = response.message as string;
        } else {
          this.errorMessage = response.message as string;
      }
    });
  }

  /** ==== DELETE DELIVERY:
  * Delete a delivery document on the server */

  deleteDelivery() {
    this.errorMessage = '';
    if (!this.deliveryId) {
      this.errorMessage = 'No delivery ID provided';
      return;
    }

    this.deliveryService.delete(this.deliveryId)
      .subscribe((response) => {
        if (response.code === OK) {
          this.successMessage = response.message as string;
        } else {
          this.errorMessage = response.message as string;
      }
    });
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
}
