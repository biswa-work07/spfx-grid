import { Item } from "sp-pnp-js";

export interface IItem {
  Id?: number;
  Company?: string;
  Contact?: string;
  Country?: ICountry;
  fileContent?: any;
  isEditable?: boolean;
}

export interface ICountry {
  Id?: number;
  CountryName?: string;
}

export interface IMainContainerComponentState {

  disabled: boolean;
  checked: boolean;
  drpOptions: Array<any>;
  selectedItem?: { key: string | number | undefined };

  TestProperty1: any;
  hideDialog: any;
  showModal: boolean;
  items: IItem[];
  editItem?:IItem;
}
