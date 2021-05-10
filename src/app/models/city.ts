import {ModelBase} from "./model-base";
import {State} from "./state";

export class City extends ModelBase {
  name: string;
  state: State | string;
}
