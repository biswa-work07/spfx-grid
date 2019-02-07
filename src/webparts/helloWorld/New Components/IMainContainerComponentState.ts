export interface IItem {
  Id?: number;
  Company?: string;
  Contact?: string;
  CountryName: ICountryName;
  isEditable?:boolean;
}

export interface ICountryName {
  Id?: string;
  CountryName?: string;
}

export interface IMainContainerComponentState {

  disabled: boolean;
  checked: boolean;
  drpOptions:Array<any>;
  selectedItem?: { key: string | number | undefined };

  TestProperty1: any;
  hideDialog: any;
  showModal: boolean;
  items: IItem[];
}
