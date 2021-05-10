import {Component, Injector} from '@angular/core';
import {Validators} from '@angular/forms';
import {BaseComponent} from '../../base-component';
import {URLS} from '../../../urls';
import {Employee} from "../../../models/employee";
import {BaseService} from "../../../services/base-service";
import {Department} from "../../../models/department";
import {District} from "../../../models/district";
import {MaritalStatus} from "../../../models/marital-status";
import {takeUntil} from "rxjs/operators";


@Component({
  selector: 'app-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
})
export class EmployeeItemComponent extends BaseComponent<Employee> {

  object: Employee = new Employee();
  departmentService: BaseService<Department>;
  districtService: BaseService<District>;
  maritalStatusService: BaseService<MaritalStatus>;

  departmentList: Department[] = [];
  districtList: District[] = [];
  maritalStatusList: MaritalStatus[] = [];

  constructor(public injector: Injector) {
    super(injector, {path: URLS.EMPLOYEE});
    this.mainService.changeTitle.next('Funcionário');
    this.departmentService = this.createService(Department, URLS.DEPARTMENT);
    this.districtService = this.createService(District, URLS.DISTRICT);
    this.maritalStatusService = this.createService(MaritalStatus, URLS.MARITAL_STATUS);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getDepartmentList();
    this.getDistrictList();
    this.getMaritalStatusList();
  }

  protected createFormGroup(): void {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(64)]],
      salary: [null, [Validators.required]],
      admission_date: [null, [Validators.required]],
      birth_date: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      department: [null, [Validators.required]],
      district: [null, [Validators.required]],
      marital_status: [null, [Validators.required]],
    });
  }

  getDepartmentList(): void {
    this.departmentService.getAll().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(response => this.departmentList = response);
  }

  getDistrictList(): void {
    this.districtService.getAll().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(response => this.districtList = response);
  }

  getMaritalStatusList(): void {
    this.maritalStatusService.getAll().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(response => this.maritalStatusList = response);
  }

  save() {
    super.save();
    this.goToPage('employee');
  }

}
