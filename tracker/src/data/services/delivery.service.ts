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

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = `${API_BASE_URL}/${DELIVERY}`;

  constructor(private http: HttpClient) {}

  /** ==== GET A DELIVERY DATA:
   * Fetch delivery details by delivery_id */
  getDeliveryById(id: string): Observable<ResponseHandler> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}


