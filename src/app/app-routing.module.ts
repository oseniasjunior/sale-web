import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StateComponent} from './components/state/state.component';
import {MaritalStatusComponent} from './components/marital-status/marital-status.component';

const routes: Routes = [
  {path: 'state', component: StateComponent},
  {path: 'marital_status', component: MaritalStatusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
