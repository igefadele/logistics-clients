import { Component, OnInit } from '@angular/core';
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

  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    // Initialize map when component is ready
    this.initializeMap();
  }

  // Fetch package and delivery details
  trackPackage() {
    if (!this.packageId) return;

    this.packageService.getPackageById(this.packageId).subscribe((response) => {
      this.packageDetails = response.data;
      const packageData = response.data;

      if (packageData.active_delivery_id) {
        this.deliveryService
          .getDeliveryById(packageData.active_delivery_id)
          .subscribe((deliveryResponse) => {
            const deliveryData = deliveryResponse.data;
            this.deliveryDetails = deliveryData;
            this.updateMap(deliveryData.location);
            this.listenForUpdates(deliveryData.delivery_id);
          });
      }
    });
  }

  // Initialize the map
  initializeMap() {
    this.map = L.map('map').setView([0, 0], 2); // Set initial view

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
    this.webSocketService.onEvent('location_changed').subscribe((event) => {
      if (event.delivery_id === deliveryId) {
        this.updateMap(event.location);
      }
    });

    this.webSocketService.onEvent('status_changed').subscribe((event) => {
      if (event.delivery_id === deliveryId) {
        this.deliveryDetails.status = event.status;
      }
    });

    this.webSocketService.onEvent('delivery_updated').subscribe((event) => {
      if (event.delivery_id === deliveryId) {
        this.deliveryDetails = event.delivery_object;
        this.updateMap(event.delivery_object.location);
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
