import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private baseUrl = 'http://localhost:3000/api/package';

  constructor(private http: HttpClient) {}

  // Fetch package details by ID
  getPackageById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
