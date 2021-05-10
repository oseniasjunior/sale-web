import {City} from "./city";
import {Zone} from "./zone";
import {ModelBase} from "./model-base";

export class District extends ModelBase {
  name: string;
  city: City | string;
  zone: Zone | string;
}
