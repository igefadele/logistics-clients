/**
==============
WEBSOCKET EVENTS PAYLOADS DATA MODELS
*/

import { IDelivery } from './delivery.model';
import { DeliveryStatus, WsEventType } from '../../data/enums';
import { ILocation } from './location.model';

/** Data model for the location_changed event payload */
export interface LocationChangedPayload {
    event: WsEventType.location_changed;
    delivery_id: string;
    location: ILocation;
}

/** Data model for the status_changed event payload */
export interface StatusChangedPayload {
    event: WsEventType.status_changed;
    delivery_id: string;
    status: DeliveryStatus;
}
/** Data model for the delivery_updated event payload */
export interface DeliveryUpdatedPayload {
    event: WsEventType.delivery_updated;
    delivery_object: IDelivery;
}

/** Encapsulating Payload data model type for the three possible event payloads */
export type DeliveryEventPayload = LocationChangedPayload | StatusChangedPayload | DeliveryUpdatedPayload;
export type DeliveryOutgoingEventPayload = LocationChangedPayload | StatusChangedPayload;
export type DeliveryIncomingEventPayload = DeliveryUpdatedPayload;
