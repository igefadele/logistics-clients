import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPackage } from '../../data/models/package.model';
import { formatLocation } from '../../core/utils';
import { PackageService } from '../../data/services/package.service';
import { OK, ROUTE_EDIT_PACKAGE } from '../../core/constants';
import { CommonModule } from '@angular/common';
import { DatastoreService } from '../../data/services/datastore.service';

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

  constructor(
    private router: Router,
    private packageService: PackageService,
    private route: ActivatedRoute,
    private datastoreService: DatastoreService,
  ) {}

  ngOnInit(): void {
    // Subscribe to the selectedPackage$ observable from DatastoreService
    this.datastoreService.selectedPackage$
      .subscribe((packageDetails: IPackage | null) => {
      this.packageDetails = packageDetails;
    });
  }

   /** ==== GET PACKAGE ROUTE ID PARAM:
  * Get the /:id param value from the route */

  getRouteIdParam(): string | null {
    const packageId = this.route.snapshot.paramMap.get('id');
    if (packageId) {
      return packageId;
    }
    return null
  }

  /** ==== VIEW EDIT PACKAGE ROUTE: */
  viewEditPackage() {
    this.router.navigate([ROUTE_EDIT_PACKAGE]);
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
}
