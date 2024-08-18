import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PackageService } from '../services/package.service';
import { DeliveryService } from '../services/delivery.service';
import { WebSocketService } from '../services/websocket.service';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


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
  packageDetails: any;
  deliveryDetails: any;
  map: any;
  markers: { [key: string]: L.Marker } = {};
  errorMessage: string = '';

  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

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
        const packageData = response.data;
        this.packageDetails = packageData;
        this.initializeMap(packageData.from_location, packageData.to_location);
        //this.initializeMap();

        if (packageData.active_delivery_id) {
          this.deliveryService.getDeliveryById(packageData.active_delivery_id).subscribe((deliveryResponse) => {
            if (deliveryResponse.data) {
              const deliveryData = deliveryResponse.data;
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


  // Initialize the map and add markers for from_location and to_location
  initializeMap(fromLocation: { lat: number; lng: number; }, toLocation: { lat: number; lng: number; }) {
    // Set initial view
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.addMarker(fromLocation, 'From Location', 'from_location');
    this.addMarker(toLocation, 'To Location', 'to_location');
  }

   /*  initializeMap() {
      this.map = L.map('map').setView([0, 0], 2); // Set initial view

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      // Add from_location marker
      const fromLocation = { lat: 37.7749, lng: -122.4194 };
      this.addMarker(fromLocation, 'From Location', 'from_location');

      // Add to_location marker
      const toLocation = { lat: 40.7118, lng: -84.016 };
      this.addMarker(toLocation, 'To Location', 'to_location');
    } */


  // Add a marker to the map and save it in the markers object
  addMarker(location: { lat: number; lng: number }, title: string, key: string) {
    const marker = L.marker([location.lat, location.lng]).addTo(this.map)
      .bindPopup(title)
      .openPopup();
    this.markers[key] = marker;
  }


  // Update the map with the current delivery location
  updateMap(location: { lat: number; lng: number }) {
    if (this.markers['current_location']) {
      this.map.removeLayer(this.markers['current_location']);
    }

    const marker = L.marker([location.lat, location.lng]).addTo(this.map)
      .bindPopup('Current Location')
      .openPopup();

    this.markers['current_location'] = marker;
    this.map.setView([location.lat, location.lng], 13); // Optionally, center the map on the current location
  }


  // Listen for WebSocket updates
  listenForUpdates(deliveryId: string) {
    this.webSocketService.onEvent('delivery_updated').subscribe((payload) => {
      if (payload.delivery_object.delivery_id === deliveryId) {
        this.deliveryDetails = payload.delivery_object;
        const currentLocation = payload.delivery_object.location;
        this.updateMap(currentLocation);
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
