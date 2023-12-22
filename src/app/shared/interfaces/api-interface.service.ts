import { Page } from "app/pages/object-key/store/object-key.model";
import { Observable } from "rxjs";

export interface IApiService<T, E> {
  fetchAll(): Observable<T[]>;
  fetchPage(): Observable<Page<T>>;
  load(id: number): Observable<T>;
  saveOne(e: E): Observable<T>;
  updateOne(id: number, updates: E): Observable<T>;
  removeOne(id: number): Observable<any>;
}
export interface IKeyVal{ value: number; label:string}