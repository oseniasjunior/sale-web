import {InjectionToken, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaginatedResult} from '../paginated-result';
import {MatPaginator} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseService} from '../services/base-service';
import {HttpClient} from '@angular/common/http';


interface Options {
  path: string;
}

export abstract class BaseListComponent<T> implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  paginated: PaginatedResult<T> = new PaginatedResult<T>();
  displayedColumns = [];
  unsubscribe = new Subject();
  http: HttpClient;
  service: BaseService<T>;

  protected constructor(public injector: Injector, public options: Options) {
    this.http = this.injector.get(HttpClient);
    this.service = this.injector.get(this._serviceToken());
  }

  private _serviceToken(): InjectionToken<BaseService<T>> {
    return new InjectionToken<BaseService<T>>('service_' + this.options.path, {
      providedIn: 'root', factory: () => new BaseService<T>(this.http, this.options.path),
    });
  }

  // public createService<K>(model: new () => K, path: string): BaseService<K> {
  //   const TOKEN = new InjectionToken<BaseService<K>>('service_' + path, {
  //     providedIn: 'root', factory: () => new BaseService<K>(this.http, path),
  //   });
  //   return this.injector.get(TOKEN);
  // }

  ngOnInit(): void {
    this.configurePaginator();
    this.getPaginated();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private configurePaginator(): void {
    this.paginator.pageSize = 10;
    this.paginator.pageSizeOptions = [10, 20, 30, 40, 50];
    this.paginator.page.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(() => this.getPaginated());
  }

  getPaginated(): void {
    this.service.addParameter('limit', this.paginator.pageSize);
    this.service.addParameter('offset', this.paginator.pageSize * this.paginator.pageIndex);
    this.service.getPaginatedResult().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(response => this.paginated = response);
  }

}
