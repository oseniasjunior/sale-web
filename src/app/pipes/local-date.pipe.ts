import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {Subject} from 'rxjs';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'localDate',
  pure: false
})

export class LocalDatePipe implements PipeTransform, OnDestroy {
  unsubscribe = new Subject();
  public value: string;
  public pattern: string;

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  transform(value: any, pattern = 'short'): any {
    this.value = value;
    this.pattern = pattern;

    if (this.pattern === 'short') {
      this.pattern = 'dd/MM/yyyy HH:mm';
    } else if (this.pattern === 'shortDate') {
      this.pattern = 'dd/MM/yyyy';
    } else if (this.pattern === 'shortTime') {
      this.pattern = 'HH:mm';
    }
    const pipe = new DatePipe('pt-BR');
    return pipe.transform(this.value, this.pattern);
  }

}
