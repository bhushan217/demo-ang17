import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { ObjectKey, ObjectKeyRequiredProps, Page } from './object-key.model';
import { map } from 'rxjs/operators';

const BASE_URL = `${environment.apiUrl}/api/objectKeys/list`;
const HEADER = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ObjectKeysService {
  constructor(private http: HttpClient) {}

  fetchAll() {
    return this.http.get<Page<ObjectKey>>(BASE_URL).pipe(map(data=> data.content));
  }

  load(id: string) {
    return this.http.get<ObjectKey>(`${BASE_URL}/${id}`);
  }

  create(objectKeyProps: ObjectKeyRequiredProps) {
    const ObjectKey: ObjectKey = {
      id: 0,
      ...objectKeyProps,
    };

    return this.http.post<ObjectKey>(
      `${BASE_URL}`,
      JSON.stringify(ObjectKey),
      HEADER
    );
  }

  update(id: number, updates: ObjectKeyRequiredProps) {
    return this.http.patch<ObjectKey>(
      `${BASE_URL}/${id}`,
      JSON.stringify(updates),
      HEADER
    );
  }

  delete(id: number) {
    return this.http.delete(`${BASE_URL}/${id}`);
  }
}