import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { UiType, UiTypeRequiredProps } from './ui-type.model';

const BASE_URL = `${environment.apiUrl}/api/uiTypes`;
const HEADER = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UiTypesApiService {
  constructor(private http: HttpClient) {}

  fetchAll() {
    return this.http.get<UiType[]>(BASE_URL);
  }

  load(id: string) {
    return this.http.get<UiType>(`${BASE_URL}/${id}`);
  }

  create(uiTypeProps: UiTypeRequiredProps) {
    const UiType: UiType = {
      id: 0,
      ...uiTypeProps,
    };

    return this.http.post<UiType>(
      `${BASE_URL}`,
      JSON.stringify(UiType),
      HEADER
    );
  }

  update(id: number, updates: UiTypeRequiredProps) {
    return this.http.patch<UiType>(
      `${BASE_URL}/${id}`,
      JSON.stringify(updates),
      HEADER
    );
  }

  delete(id: number) {
    return this.http.delete(`${BASE_URL}/${id}`);
  }
}