import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GeneratePdfResponse {
  fileName: string;
  fileBase64: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private apiUrl = `${environment.apiUrl}/GeneratePdf/generatePdf`;

  constructor(private http: HttpClient) {}

  generatePdf(dto: any): Observable<GeneratePdfResponse> {
    return this.http.post<GeneratePdfResponse>(this.apiUrl, dto);
  }
}
