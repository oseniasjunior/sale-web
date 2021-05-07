import {Component, OnDestroy} from '@angular/core';
import {MainService} from './services/main-service';
import {Subject} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title: string = 'Bem vindo';
  unsubscribe = new Subject();

  constructor(private mainService: MainService) {
    this.changeTitle();
  }

  private changeTitle(): void {
    this.mainService.changeTitle.pipe(
      takeUntil(this.unsubscribe),
      distinctUntilChanged(),
    ).subscribe(nextTitle => this.title = nextTitle);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
