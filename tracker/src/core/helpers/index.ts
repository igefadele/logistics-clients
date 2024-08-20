/*
==================
BASE HELPERS
*/


import { IDelivery } from "../../data/models/delivery.model";
import { IPackage } from "../../data/models/package.model";
import { EntityKey } from "../../data/enums";

interface BaseEntity extends Document {
  _id: string;
}

/** ==== GET ENTITY:
Get the Entity which its enum key is provided */
export function getEntity(key: EntityKey) {
  switch (key) {
    default:
      throw new Error(`====\n\ngetEntity Instance: Invalid EntityKey key: ${key}\n\n====`);
  }
}
