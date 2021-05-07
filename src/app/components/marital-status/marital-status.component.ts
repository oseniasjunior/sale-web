import {Component, Injector} from '@angular/core';
import {MaritalStatus} from '../../models/marital-status';
import {BaseComponent} from '../base-component';
import {URLS} from '../../urls';

@Component({
  selector: 'app-marital-status',
  templateUrl: './marital-status.component.html',
  styleUrls: ['./marital-status.component.scss']
})
export class MaritalStatusComponent extends BaseComponent<MaritalStatus> {

  displayedColumns = ['id', 'name', 'created_at', 'modified_at'];

  constructor(public injector: Injector) {
    super(injector, {path: URLS.MARITAL_STATUS});
  }

  getPaginated() {
    this.service.clearParameter();
    super.getPaginated();
  }

  protected createFormGroup(): void {
  }

}
