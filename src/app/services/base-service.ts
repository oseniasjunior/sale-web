import {HttpClient, HttpParams, HttpUserEvent} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {PaginatedResult} from '../paginated-result';

export class BaseService<T> {
  urlBase = 'http://127.0.0.1:8000/api/sale/core';
  private parameters: HttpParams = new HttpParams();

  constructor(private http: HttpClient, private path: string) {
  }

  public clearParameter(): void {
    this.parameters = new HttpParams();
  }

  public addParameter(key: string, value: any): void {
    this.parameters = this.parameters.append(key, value);
  }

  private getOptions(): any {
    const httpOptions = {};
    if (this.parameters) {
      httpOptions['params'] = this.parameters;
    }
    return httpOptions;
  }

  public getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.urlBase}/${this.path}/`, this.getOptions()).pipe(
      tap(response => response as HttpUserEvent<T[]>),
      catchError(ex => from([]))
    );
  }

  public getPaginatedResult(): Observable<PaginatedResult<T>> {
    return this.http.get<PaginatedResult<T>>(`${this.urlBase}/${this.path}/`, this.getOptions()).pipe(
      tap(response => response as HttpUserEvent<PaginatedResult<T>>),
      catchError(ex => from([]))
    );
  }

  public save(aObject: T): Observable<T> {
    return this.http.post(`${this.urlBase}/${this.path}/`, aObject).pipe(
      tap(response => response as HttpUserEvent<T>),
      catchError(ex => from([]))
    );
  }

  public delete(pk: number | string): Observable<void> {
    this.clearParameter();
    return this.http.delete(`${this.urlBase}/${this.path}/${pk}/`).pipe(
      tap(response => response as HttpUserEvent<void>),
      catchError(ex => from([]))
    );
  }


}
