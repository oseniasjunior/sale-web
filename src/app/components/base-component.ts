import {Directive, InjectionToken, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaginatedResult} from '../paginated-result';
import {MatPaginator} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseService} from '../services/base-service';
import {HttpClient} from '@angular/common/http';
import {NavigationExtras, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MainService} from '../services/main-service';


interface Options {
  path: string;
}

@Directive()
export abstract class BaseComponent<T> implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  paginated: PaginatedResult<T> = new PaginatedResult<T>();
  displayedColumns = [];
  unsubscribe = new Subject();
  http: HttpClient;
  service: BaseService<T>;
  router: Router;
  fb: FormBuilder;
  mainService: MainService;
  formGroup: FormGroup;
  object: T;

  protected constructor(public injector: Injector, public options: Options) {
    this.http = this.injector.get(HttpClient);
    this.router = this.injector.get(Router);
    this.fb = this.injector.get(FormBuilder);
    this.mainService = this.injector.get(MainService);
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
    this.createFormGroup();
    if (this.paginator) {
      this.configurePaginator();
      this.getPaginated();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  protected abstract createFormGroup(): void;

  private configurePaginator(): void {
    this.paginator.pageSize = 10;
    this.paginator.pageSizeOptions = [10, 20, 30, 40, 50];
    this.paginator.page.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(() => this.getPaginated());
  }

  public save(): void {
    Object.assign(this.object, this.formGroup.getRawValue());
    this.service.save(this.object).pipe(
      takeUntil(this.unsubscribe),
    ).subscribe(() => {
      this.goToPage('zone');
    });
  }

  getPaginated(): void {
    this.service.addParameter('limit', this.paginator.pageSize);
    this.service.addParameter('offset', this.paginator.pageSize * this.paginator.pageIndex);
    this.service.getPaginatedResult().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(response => this.paginated = response);
  }

  public goToPage(path: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate([path], extras).then();
  }

  getErrorMessage(fieldName: string): string {
    if (this.formGroup.controls[fieldName].hasError('required')) {
      return 'Required field';
    }
    return 'error';
  }

}
