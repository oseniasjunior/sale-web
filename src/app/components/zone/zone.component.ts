import {Component, Injector} from '@angular/core';
import {BaseComponent} from '../base-component';
import {Zone} from '../../models/zone';
import {URLS} from '../../urls';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {take, takeUntil} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent extends BaseComponent<Zone> {

  displayedColumns = ['id', 'name', 'created_at', 'modified_at', 'action'];

  constructor(public injector: Injector) {
    super(injector, {path: URLS.ZONE});
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
