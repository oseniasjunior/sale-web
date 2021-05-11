import {Directive, InjectionToken, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaginatedResult} from '../paginated-result';
import {MatPaginator} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseService} from '../services/base-service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MainService} from '../services/main-service';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";


interface Options {
  path: string;
  nextRouterSave?: string;
  nextRouterUpdate?: string;
}


interface Params {
  action: string;
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
  dialog: MatDialog;
  activatedRouter: ActivatedRoute;
  pk?: number;

  protected constructor(public injector: Injector, public options: Options) {
    this.http = this.injector.get(HttpClient);
    this.router = this.injector.get(Router);
    this.fb = this.injector.get(FormBuilder);
    this.mainService = this.injector.get(MainService);
    this.dialog = this.injector.get(MatDialog);
    this.activatedRouter = this.injector.get(ActivatedRoute);
    this.service = this.injector.get(this._serviceToken());
  }

  private _serviceToken(): InjectionToken<BaseService<T>> {
    return new InjectionToken<BaseService<T>>('service_' + this.options.path, {
      providedIn: 'root', factory: () => new BaseService<T>(this.http, this.options.path),
    });
  }

  public createService<K>(model: new () => K, path: string): BaseService<K> {
    const TOKEN = new InjectionToken<BaseService<K>>('service_' + path, {
      providedIn: 'root', factory: () => new BaseService<K>(this.http, path),
    });
    return this.injector.get(TOKEN);
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.retrieveOnInit();
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

  public saveOrUpdate(): void {
    Object.assign(this.object, this.formGroup.getRawValue());
    if (!this.pk) {
      this.service.save(this.object).pipe(
        takeUntil(this.unsubscribe),
      ).subscribe((response) => {
        this.object = response;
        this.pk = this.object['id'];
        if (this.options.nextRouterSave) {
          this.goToPage(this.options.nextRouterSave);
        }
      });
    } else {
      this.service.update(this.object, this.pk).pipe(
        takeUntil(this.unsubscribe)
      ).subscribe(response => {
        this.object = response;
        if (this.options.nextRouterUpdate) {
          this.goToPage(this.options.nextRouterUpdate);
        }
      });
    }
  }

  retrieveOnInit(): void {
    this.activatedRouter.params.subscribe((params: Params) => {
      if (params.action) {
        if (params.action !== 'create') {
          this.pk = Number(params.action);
          this.service.getById(this.pk).subscribe(response => {
            this.object = response;
            this.formGroup.reset(this.object);
          });
        }
      }
    });
  }

  getPaginated(): void {
    this.service.addParameter('limit', this.paginator.pageSize);
    this.service.addParameter('offset', this.paginator.pageSize * this.paginator.pageIndex);
    this.service.getPaginatedResult().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(response => this.paginated = response);
  }

  delete(pk: number, description: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {pk: pk, description: description}
    });
    dialogRef.afterClosed().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(response => {
      if (response) {
        this.service.delete(pk).pipe(
          takeUntil(this.unsubscribe)
        ).subscribe(() => {
          this.getPaginated();
        }, (exception) => {
          console.log('Erro ao deletar. Verifique se o registro não está sendo usado em outros cadastros');
        });
      }
    });
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
