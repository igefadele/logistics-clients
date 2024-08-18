import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { PackageService } from '../services/package.service';
import { DeliveryService } from '../services/delivery.service';
import { WebSocketService } from '../services/websocket.service';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css'],
})
export class TrackerComponent implements OnInit {
  packageId: string = '';
  packageDetails: any;
  deliveryDetails: any;
  map: any;
  errorMessage: string = '';

  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.initializeMap();
  }

  // Fetch package and delivery details
  trackPackage() {
    this.packageDetails = null;
    this.deliveryDetails = null;
    this.errorMessage = '';
    this.map = null;

    if (!this.packageId) {
      this.errorMessage = 'No packageId provided';
      return;
    }

    this.packageService.getPackageById(this.packageId).subscribe((response) => {
      if (response.data) {
        this.packageDetails = response.data;
        const packageData = response.data;

        if (packageData.active_delivery_id) {
          this.deliveryService.getDeliveryById(packageData.active_delivery_id).subscribe((deliveryResponse) => {
            if (deliveryResponse.data) {
              const deliveryData = deliveryResponse.data;
              this.deliveryDetails = deliveryData;
              //this.updateMap(deliveryData.location);
              console.log('Starting to listen for updates for delivery ID:', deliveryData.delivery_id);

              this.listenForUpdates(deliveryData.delivery_id);
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


  // Initialize the map
  initializeMap() {
    // To set initial view
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  // Update the map with the delivery location
  updateMap(location: { lat: number; lng: number }) {
    this.map.setView([location.lat, location.lng], 13);
    L.marker([location.lat, location.lng]).addTo(this.map);
  }

  // Listen for WebSocket updates
  listenForUpdates(deliveryId: string) {
    console.log('listenForUpdates: Called!!!');
    this.webSocketService.onEvent('location_changed').subscribe((event) => {
      if (event.delivery_id === deliveryId) {
        this.updateMap(event.location);
        this.cdr.detectChanges();
      }
    });

    this.webSocketService.onEvent('status_changed').subscribe((event) => {
      if (event.delivery_id === deliveryId) {
        this.deliveryDetails.status = event.status;
        this.cdr.detectChanges();
      }
    });

    this.webSocketService.onEvent('delivery_updated').subscribe((payload) => {
      if (payload.delivery_object.delivery_id === deliveryId) {
        this.deliveryDetails = payload.delivery_object;
        this.updateMap(payload.delivery_object.location);
        this.cdr.detectChanges();
      }
    });
  }
}



/*
Package
_id: 66bf44d477da7bd5fc27c0c0
package_id: f3f68498-eb05-4214-b87d-aadfd7168fcc
active_delivery_id: 95ca4f3d-7792-4b76-804c-b6a23d59e31f

*/


/*
Delivery
_id: 66bf48f4c34faeb00856f3d4
delivery_id: 95ca4f3d-7792-4b76-804c-b6a23d59e31f
package_id: f3f68498-eb05-4214-b87d-aadfd7168fcc
*/
