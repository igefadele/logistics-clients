import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPackage } from '../../data/models/package.model';
import { formatLocation } from '../../core/utils';
import { PackageService } from '../../data/services/package.service';
import { v4 as uuidv4 } from 'uuid';
import { OK } from '../../core/constants';
import { IDelivery } from '../../data/models/delivery.model';
import { ILocation } from '../../data/models/location.model';
import { FormsModule } from '@angular/forms';
import { DatastoreService } from '../../data/services/datastore.service';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../../data/services/delivery.service';

@Component({
  selector: 'app-create-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-package.component.html',
  styleUrl: './create-package.component.css'
})
export class CreatePackageComponent implements OnInit{
  packageId: string = '';
  packageDetails?: IPackage;
  deliveryDetails?: IDelivery;
  errorMessage: string = '';
  successMessage: string = '';
  formatLocation = formatLocation;
  newPackageData: IPackage = {} as IPackage;

  packageList: IPackage[] = [];
  deliveryList: IDelivery[] = [];

  fromLocation: ILocation = <ILocation>{};
  toLocation: ILocation = <ILocation>{};

  @ViewChild('packageModal') packageModal: any;
  @ViewChild('deliveryModal') deliveryModal: any;

  constructor(
    private modalService: NgbModal,
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private datastoreService: DatastoreService,
  ) { }

  ngOnInit(): void {
    this.packageService.getAll()
      .subscribe((response) => {
        if (response.data) {
          this.packageList = response.data as IPackage[];
        } else {
          console.log('No package list found');
        }
      })

      this.deliveryService.getAll()
      .subscribe((response) => {
        if (response.data) {
          this.deliveryList = response.data as IDelivery[];
        } else {
          console.log('No delivery list found');
        }
      })
  }

  openPackageModal() {
    this.modalService.open(this.packageModal);
  }

  openDeliveryModal() {
    this.modalService.open(this.deliveryModal);
  }

  selectDelivery(id: string) {
    if (!this.newPackageData) {
      this.errorMessage = 'No new package data provided';
      console.log(this.errorMessage);
      return;
    }
    this.newPackageData.active_delivery_id = id;
    console.log('active_delivery_id: ', id);
  }

  /** ==== CREATE PACKAGE:
  * Create new package document on the server */

  createPackage() {
    this.errorMessage = '';
    if (!this.newPackageData) {
      this.errorMessage = 'No new package data provided';
      return;
    }

    const newPackageId = uuidv4();
    this.newPackageData.package_id = newPackageId;

    this.packageService.create(this.newPackageData)
      .subscribe((response) => {
        console.log('response: ', response);
        if (response.code === OK) {
          this.successMessage = response.message as string;
          console.log('successMessage: ', this.successMessage);
        } else {
          this.errorMessage = response.message as string;
          console.log('errorMessage: ', this.errorMessage);
       }
     });
  }

}
