import {Component, Injector} from '@angular/core';
import {State} from '../../models/state';
import {BaseComponent} from '../base-component';
import {URLS} from '../../urls';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent extends BaseComponent<State> {

  displayedColumns = ['id', 'name', 'abbreviation', 'created_at', 'modified_at', 'action'];

  constructor(public injector: Injector) {
    super(injector, {path: URLS.STATE});
  }

  getPaginated() {
    this.service.clearParameter();
    super.getPaginated();
  }

  protected createFormGroup(): void {
  }
}
