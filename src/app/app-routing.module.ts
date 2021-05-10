import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StateComponent} from './components/state/state.component';
import {MaritalStatusComponent} from './components/marital-status/marital-status.component';
import {ZoneComponent} from './components/zone/zone.component';
import {ZoneItemComponent} from './components/zone/zone-item/zone-item.component';
import {EmployeeComponent} from "./components/employee/employee.component";
import {EmployeeItemComponent} from "./components/employee/employee-item/employee-item.component";

const routes: Routes = [
  {path: 'state', component: StateComponent},
  {path: 'marital_status', component: MaritalStatusComponent},
  {path: 'zone', component: ZoneComponent},
  {path: 'zone/:action', component: ZoneItemComponent},
  {path: 'employee', component: EmployeeComponent},
  {path: 'employee/:action', component: EmployeeItemComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
