import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { UserRequest } from './ok.state';
// import { UserRequest } from '@interfaces/user.request';


const BASE_URL = `${environment.apiUrl}/api/objectKeys`;
const HEADER = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

/**
 * UsersService
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  getAuthorizationToken() {
    return 'some-auth-token'
  }
  /**
   * Class constructor
   */
  constructor(private http: HttpClient) {}

  // Necesario tener arrancado Mockoon y el servicio /users que trae por defecto
  // https://mockoon.com/
  get() {
    return this.http.get<UserRequest>(`${BASE_URL}/users`);
  }
}