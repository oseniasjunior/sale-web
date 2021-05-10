import {Component, Injector} from '@angular/core';
import {BaseComponent} from '../base-component';
import {URLS} from '../../urls';
import {Employee} from "../../models/employee";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent extends BaseComponent<Employee> {

  displayedColumns = ['id', 'name', 'salary', 'admission_date', 'created_at', 'modified_at'];

  constructor(public injector: Injector) {
    super(injector, {path: URLS.EMPLOYEE});
  }

  protected createFormGroup() {
    this.formGroup = this.fb.group({
      name: []
    });
  }

  getPaginated() {
    this.service.clearParameter();
    this.service.addParameter('ordering', '-id');
    if (this.formGroup.controls.name.value) {
      this.service.addParameter('name', this.formGroup.controls.name.value);
    }
    super.getPaginated();
  }

}
