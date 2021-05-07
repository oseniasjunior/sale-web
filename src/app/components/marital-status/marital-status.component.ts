import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {PaginatedResult} from '../../paginated-result';
import {State} from '../../models/state';
import {MatPaginator} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {BaseService} from '../../services/base-service';
import {takeUntil} from 'rxjs/operators';
import {MaritalStatus} from '../../models/marital-status';
import {BaseListComponent} from '../base-list-component';

@Component({
  selector: 'app-marital-status',
  templateUrl: './marital-status.component.html',
  styleUrls: ['./marital-status.component.scss']
})
export class MaritalStatusComponent extends BaseListComponent<MaritalStatus> {

  displayedColumns = ['id', 'name', 'created_at', 'modified_at'];

  constructor(public injector: Injector) {
    super(injector, {path: 'marital_status'});
  }

  getPaginated() {
    this.service.clearParameter();
    super.getPaginated();
  }

}
