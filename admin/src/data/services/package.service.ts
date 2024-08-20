/**
==============
PACKAGE SERVICE
==============
*/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, PACKAGE } from '../../core/constants';
import { ResponseHandler } from '../models/response_handler';
import { IPackage } from '../models/package.model';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private baseUrl = `${API_BASE_URL}/${PACKAGE}`;

  constructor(private http: HttpClient) { }

  /** ==== GET A DELIVERY DATA:
   * Fetch package details by package_id from the server */
  getPackageById(id: string): Observable<ResponseHandler> {
    const response = this.http.get<any>(`${this.baseUrl}/${id}`);
    return response;
  }

  /** ==== GET ALL PACKAGES:
  * Fetch all packages from the server */
  getAll(): Observable<ResponseHandler> {
    return this.http.get<any>(this.baseUrl);
  }

  /** ==== CREATE PACKAGE:
   * Create new package document on the server */
  create(data: IPackage): Observable<ResponseHandler> {
    const url = `${this.baseUrl}/${data.package_id}`;
    const response = this.http.post<any>(url, data);
    return response;
  }

  /** ==== UPDATE PACKAGE:
   * Update a package document on the server */
  update(data: IPackage): Observable<ResponseHandler> {
    const url = `${this.baseUrl}/${data.package_id}`;
    const response = this.http.put<any>(url, data);
    return response;
  }

  /** ==== DELETE PACKAGE:
   * Delete a package document on the server */
  delete(id: string): Observable<ResponseHandler> {
    const url = `${this.baseUrl}/${id}`;
    const response = this.http.delete<any>(url);
    return response;
  }
}



