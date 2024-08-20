/**
==============
PACKAGE SERVICE
==============
*/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, PACKAGE } from '../../core/constants';
import { ResponseHandler } from '../../data/models/response_handler';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private baseUrl = `${API_BASE_URL}/${PACKAGE}`;

  constructor(private http: HttpClient) { }

  /** ==== GET A DELIVERY DATA:
   * Fetch package details by ID */
  getPackageById(id: string): Observable<ResponseHandler> {
    const response = this.http.get<any>(`${this.baseUrl}/${id}`);
    return response;
  }
}



