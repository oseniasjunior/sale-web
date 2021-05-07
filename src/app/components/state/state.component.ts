import {Component, Injector, OnInit} from '@angular/core';
import {State} from '../../models/state';
import {takeUntil} from 'rxjs/operators';
import {BaseListComponent} from '../base-list-component';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent extends BaseListComponent<State> {

  displayedColumns = ['id', 'name', 'abbreviation', 'created_at', 'modified_at'];

  constructor(public injector: Injector) {
    super(injector, {path: 'state'});
  }

  getPaginated() {
    this.service.clearParameter();
    super.getPaginated();
  }
}
