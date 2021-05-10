import {ModelBase} from "./model-base";
import {Department} from "./department";
import {District} from "./district";
import {MaritalStatus} from "./marital-status";

export class Employee extends ModelBase {
  name: string;
  salary: number;
  admission_date: Date;
  birth_date: Date;
  gender: string;
  department: Department | string;
  district: District | string;
  marital_status: MaritalStatus | string;
}
