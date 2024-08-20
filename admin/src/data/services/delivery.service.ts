/**
==============
DELIVERY SERVICE
==============
*/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, DELIVERY } from '../../core/constants';
import { ResponseHandler } from '../models/response_handler';
import { IDelivery } from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = `${API_BASE_URL}/${DELIVERY}`;

  constructor(private http: HttpClient) {}

  /** ==== GET A DELIVERY DATA:
   * Fetch delivery details by delivery_id from the server */
  getDeliveryById(id: string): Observable<ResponseHandler> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** ==== GET ALL DELIVERIES:
  * Fetch all deliveries from the server */
  getAll(): Observable<ResponseHandler> {
    return this.http.get<any>(this.baseUrl);
  }

  /** ==== CREATE DELIVERY:
  * Create new delivery document on the server */
  create(data: IDelivery): Observable<ResponseHandler> {
    const url = `${this.baseUrl}/${data.delivery_id}`;
    const response = this.http.post<any>(url, data);
    return response;
  }

  /** ==== UPDATE DELIVERY:
   * Update a delivery document on the server */
  update(data: IDelivery): Observable<ResponseHandler> {
    const url = `${this.baseUrl}/${data.delivery_id}`;
    const response = this.http.put<any>(url, data);
    return response;
  }

   /** ==== DELETE DELIVERY:
   * Delete a delivery document on the server */
   delete(id: string): Observable<ResponseHandler> {
    const url = `${this.baseUrl}/${id}`;
    const response = this.http.delete<any>(url);
    return response;
  }
}


