import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = 'http://localhost:3000/api/delivery';

  constructor(private http: HttpClient) {}

  // Fetch delivery details by ID
  getDeliveryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}


