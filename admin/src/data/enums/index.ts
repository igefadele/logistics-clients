/**
===================
BASE ENUMS
*/

export enum EntityKey {
  delivery = 'delivery',
  package = 'package',
}

export enum DeliveryStatus {
  open = 'open',
  pickedUp = 'picked-up',
  inTransit = 'in-transit',
  delivered = 'delivered',
  failed = 'failed',
}

export enum WsEventType {
  location_changed = "location_changed",
  status_changed = "status_changed",
  delivery_updated = "delivery_updated",
}

export enum IncomingWsEventType {
  delivery_updated = "delivery_updated",
}

export enum OutgoingWsEventType {
  location_changed = "location_changed",
  status_changed = "status_changed",
}

export enum SavedDataKey {
  package = 'package',
  delivery = 'delivery',
  packageList = 'packageList',
  deliveryList = 'deliveryList',
  packageId = 'packageId',
  deliveryId = 'deliveryId',
}
