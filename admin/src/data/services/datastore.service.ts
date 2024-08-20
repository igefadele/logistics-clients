/*
=================
DATASTORE SERVICE
*/

import { Injectable } from '@angular/core';
import { IPackage } from '../models/package.model';
import { IDelivery } from '../models/delivery.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseEntityType } from '../models/base_entity.model';
import { EntityKey } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class DatastoreService {
  private selectedPackage?: IPackage | null ;
  private selectedDelivery?: IDelivery | null;

  private selectedPackageSubject = new BehaviorSubject<IPackage | null>(null);
  selectedPackage$: Observable<IPackage | null> = this.selectedPackageSubject.asObservable();

  private selectedDeliverySubject = new BehaviorSubject<IDelivery | null>(null);
  selectedDelivery$: Observable<IDelivery | null> = this.selectedDeliverySubject.asObservable();

  /** ==== SET OBSERVABLE DATA:
  * Set an observable data which can be subscribed to in any component */
  setObsData(key: EntityKey, data: BaseEntityType): void {
    let value: BaseEntityType;
    switch (key) {
      case EntityKey.package:
        value = data as IPackage
        this.selectedPackageSubject.next(value);
        break;
      case EntityKey.delivery:
        value = data as IDelivery
        this.selectedDeliverySubject.next(value);
        break;
      default:
        throw new Error (`Provided ${key} don't match any entity key`)
    }
  }

  /** ==== GET OBSERVABLE DATA (BUT ONCE)
  * Get obsservanble data once and not the updated version of the said data  */
  getObsData(key: EntityKey): BaseEntityType | null {
    switch (key) {
      case EntityKey.package:
        return this.selectedPackageSubject.getValue();
      case EntityKey.delivery:
        return this.selectedDeliverySubject.getValue();
      default:
        throw new Error (`Provided ${key} don't match any entity key`)
    }
  }


  /** ==== SET DATA
  * Set a data to the provided value */
  setData(key: EntityKey, data: BaseEntityType): void {
    let value: BaseEntityType;
    switch (key) {
      case EntityKey.package:
        value = data as IPackage
        this.selectedPackage = value;
        break;
      case EntityKey.delivery:
        value = data as IDelivery
        this.selectedDelivery = value;
        break;
      default:
        throw new Error (`Provided ${key} don't match any entity key`)
    }
  }


  /** ==== GET DATA
  * get a data value  */
  getData(key: EntityKey): BaseEntityType | null {
    switch (key) {
      case EntityKey.package:
        return this.selectedPackage as IPackage | null;
      case EntityKey.delivery:
        return this.selectedDelivery as IDelivery | null;
      default:
        throw new Error (`Provided ${key} don't match any entity key`)
    }
  }
}
