import {Component, Injector} from '@angular/core';
import {Validators} from '@angular/forms';
import {BaseComponent} from '../../base-component';
import {URLS} from '../../../urls';
import {Zone} from 'src/app/models/zone';

@Component({
  selector: 'app-zone-item',
  templateUrl: './zone-item.component.html',
  styleUrls: ['./zone-item.component.scss']
})
export class ZoneItemComponent extends BaseComponent<Zone> {

  object: Zone = new Zone();

  constructor(public injector: Injector) {
    super(injector, {path: URLS.ZONE});
    this.mainService.changeTitle.next('Zona');
  }

  protected createFormGroup(): void {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(64)]]
    });
  }

}
