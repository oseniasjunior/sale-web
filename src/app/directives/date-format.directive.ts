import {Directive, Input, OnDestroy, OnInit} from "@angular/core";
import {NgControl} from "@angular/forms";
import {MatDatepickerInput} from "@angular/material/datepicker";
import * as moment from 'moment';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Directive({
  selector: 'input[dateFormat]'
})
export class DateFormatDirective implements OnInit, OnDestroy {

  unsubscribe = new Subject();
  @Input() dateFormat = "YYYY-MM-DDTHH:mm:ssZ";

  constructor(protected formControl: NgControl,
              public dateInput: MatDatepickerInput<Date>) {
  }

  ngOnInit(): void {
    this.dateInput.dateChange.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(element => {
      const date = element.value;
      if (date) {
        const dateStr = moment(date, "YYYY-MM-DD").format(this.dateFormat);
        this.formControl.control.patchValue(dateStr);
      } else {
        this.formControl.control.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
