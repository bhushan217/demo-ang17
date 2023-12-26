

import { Organization } from '../../store/types/entity';
import { HttpClient } from '@angular/common/http';

export enum OrgApi {
  Org = '/org',
}

export class Service { 
  constructor(private http: HttpClient) {}
  getOrgList= () => this.http.get<Organization[]>( OrgApi.Org );
};