import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPackage } from '../../data/models/package.model';
import { formatLocation } from '../../core/utils';
import { PackageService } from '../../data/services/package.service';
import { FROM_LOCATION, FROM_LOCATION_TITLE, MAP, OK, ROUTE_EDIT_PACKAGE, TO_LOCATION, TO_LOCATION_TITLE } from '../../core/constants';
import { CommonModule } from '@angular/common';
import { DatastoreService } from '../../data/services/datastore.service';
import * as L from 'leaflet';
import { ILocation } from '../../data/models/location.model';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent {
  packageId: string = '';
  packageDetails?: IPackage | null;
  errorMessage: string = '';
  successMessage: string = '';
  formatLocation = formatLocation;
  map: any;
  markers: { [key: string]: L.Marker } = {};

  constructor(
    private router: Router,
    private packageService: PackageService,
    private route: ActivatedRoute,
    private datastoreService: DatastoreService,
  ) {}

  ngOnInit(): void {
    this.getRouteIdParam();
    this.getPackage(this.packageId);
  }

   /** ==== GET PACKAGE ROUTE ID PARAM:
  * Get the /:id param value from the route */

  getRouteIdParam(): string | null {
    const packageId = this.route.snapshot.paramMap.get('id');
    if (packageId) {
      this.packageId = packageId;
      return packageId;
    }
    return null
  }

  /** ==== GET PACKAGE:
  * Get package data from server using its ID */

  getPackage(packageId: string) {
    this.packageService.getPackageById(packageId).subscribe((response) => {
      this.packageDetails = response.data as IPackage;
      this.initializeMap(this.packageDetails.from_location, this.packageDetails.to_location);
    });
  }

  /** ==== VIEW EDIT PACKAGE ROUTE: */
  viewEditPackage() {
    this.router.navigate([ROUTE_EDIT_PACKAGE, this.packageId]);
  }


  /** ==== UPDATE PACKAGE:
  * Update a package document on the server */

  updatePackage() {
    this.errorMessage = '';
    if (!this.packageDetails) {
      this.errorMessage = 'No new package data provided';
      return;
    }

    this.packageService.update(this.packageDetails)
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

  deletePackage() {
    this.errorMessage = '';
    if (!this.packageId) {
      this.errorMessage = 'No package ID provided';
      return;
    }

    this.packageService.delete(this.packageId)
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

  initializeMap(fromLocation: ILocation, toLocation: ILocation) {
    this.map = L.map(MAP).setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.addMarker({location: fromLocation, title: FROM_LOCATION_TITLE, key: FROM_LOCATION});
    this.addMarker({location: toLocation, title: TO_LOCATION_TITLE, key: TO_LOCATION});
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
