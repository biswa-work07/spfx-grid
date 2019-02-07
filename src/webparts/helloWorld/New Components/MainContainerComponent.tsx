import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from '../uiFabricStyle/cust.module.scss';
import custstyle from './MainContainerComponent';

import pnp from "sp-pnp-js";


import { IItem, IMainContainerComponentState } from './IMainContainerComponentState';
import { IMainContainerComponentProps } from './IMainContainerComponentProps';


import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { css, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';

import { ConsoleListener, Web, Logger, LogLevel, ODataRaw } from "sp-pnp-js";
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';




import {
  SPHttpClient,
  SPHttpClientResponse,
  SPHttpClientConfiguration
} from "@microsoft/sp-http";


export default class MainContainerComponent extends React.Component<IMainContainerComponentProps, IMainContainerComponentState, any> {


  public constructor(props: IMainContainerComponentProps, state: IMainContainerComponentState) {
    super(props);

    this.state = {
      disabled: false,
      checked: false,
      selectedItem: null,
      hideDialog: true,
      showModal: false,
      drpOptions: [],
      items: [
        {
          Id: 0,
          Company: "",
          Contact: "",
          CountryName: null
        } as IItem
      ] as IItem[]
    } as IMainContainerComponentState;
  }

  private _showModal = (): void => {

    /////////////////////////////////////////////////
    //Loading data from site column  
    /////////////////////////////////////////////////  
    let web = pnp.sp.web;
    web.fields.getByTitle("CountryName").get().then(f => {
      console.log(f.Choices);
      this.setState({
        drpOptions: f.Choices.slice().map((c, i) => ({
          key: i,
          text: c
        }))
      });
    });
    this.setState({ showModal: true });
    /////////////////////////////////////////////////
  }

  private _closeModal = (): void => {
    this.setState({ showModal: false });
  }

  private get_Document_Library_Data = _id => {

    pnp.sp.web.lists
      .getByTitle("CompanyInfo")
      .items.select(
        "ID",
        "Company",
        "Contact",
        "CountryName"
      )
      .top(50)
      .orderBy("Modified", true)
      .get()
      .then((_items: any[]) => {
        
        this.setState({
          items: _items.map((i) => ({
            ...i,
            isEditable: false
          }))
        });

        // this.setState({
        //   items: _items.map((i) => ({
        //     ...i,
        //     isEditable: false
        //   }))
        // });

        //this.setState({items:_items});


      });
  }

  ////////////////////////////////////////////
  //ROW CLICK & CHANGE TO TEXT BOX ///////////
  ////////////////////////////////////////////

  private _OnRowClick = (id: any) => (ev: any) => {

    const { items } = this.state;
    const filter = items.filter(x => x.Id == id);

    if (filter && filter.length > 0) {
      const item = filter[0];      
      item.isEditable = true;

      this.setState({
        items: items.slice()
      });
    }
  }

  public componentDidMount() {
    //Load On Load
    //const result = this.fetchDatafromSharePointList("");
    //console.log("componentDidMount");
    //this.REST_Fetch_Data_SharePoint_List();

    this.get_Document_Library_Data(0);
  }



  ////////////////////////////////////////////////////
  //REST CALL/////////////////////////////////////////
  ////////////////////////////////////////////////////
  private REST_Fetch_Data_SharePoint_List() {
    let siteUrl = this.props.context.pageContext.web.absoluteUrl;

    this.props.context.spHttpClient
      .get(
        `${
        this.props.context.pageContext.web.absoluteUrl
        }/_api/lists/GetByTitle('CompanyInfo')/items`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON: any) => {
          //console.log("print - " + responseJSON.value[0].Active);
          //this.setState({ items: responseJSON.value });
          console.log(responseJSON.value);
        });
      });
  }

  private DeleteItem(): void {
    let web = pnp.sp.web;
  }

  private _reloadCompnent = (id: any) => (ev: any) => {

    this.get_Document_Library_Data(0);

  }




  public render(): React.ReactElement<IMainContainerComponentProps> {
    const { disabled, checked, selectedItem, drpOptions } = this.state;

    return (
      <div className="custstyle">
        <DefaultButton secondaryText="Opens the Sample Modal" onClick={this._showModal} text="Add New Company" />
        <DefaultButton secondaryText="Reload Component" onClick={this._reloadCompnent(1)} text="Reload Component" />

        <table id="customers">
          <tbody>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Country</th>
              <th>Action</th>
            </tr>

            {
              this.state.items.map(myitems1 => {
                if (myitems1.Id > 0) {
                  return (
                    <tr key={myitems1.Id} onClick={this._OnRowClick(myitems1.Id)}>
                      <td>
                        {myitems1.isEditable ?
                          <input type="text" value={myitems1.Company} />
                          : <span>{myitems1.Company}</span>}
                      </td>
                      <td>
                        {myitems1.Contact}
                      </td>
                      <td>
                        {myitems1.CountryName}
                      </td>

                      {myitems1.Id % 2 === 0 ? <td>
                        <DefaultButton
                          data-automation-id="test"
                          disabled={disabled}
                          checked={checked}
                          text="Delete"
                          onClick={this.DeleteItem}
                        />
                      </td> : null}


                    </tr>
                  );
                }
              })
            }

          </tbody>
        </table>

        <Modal
          titleAriaId="titleId"
          subtitleAriaId="subtitleId"
          isOpen={this.state.showModal}
          onDismiss={this._closeModal}
          isBlocking={false}
          containerClassName="ms-modalExample-container"
        >

          <div className="ms-modalExample-header">
            <table>
              <tr><td>Company</td><td> <TextField errorMessage="Error message" placeholder="I have an error message." /></td></tr>
              <tr><td>Contact</td><td> <MaskedTextField label="With number mask" mask="99999" /></td></tr>
              <tr><td>CountryName</td><td>
                <Dropdown
                  label="Controlled example:"
                  selectedKey={selectedItem ? selectedItem.key : undefined}
                  onChanged={this._log('onFocus called')}
                  onFocus={this._log('onFocus called')}
                  onBlur={this._log('onBlur called')}
                  placeholder="Select an Option"
                  options={drpOptions}
                />

              </td></tr>
            </table>
          </div>



          <div id="subtitleId" className="ms-modalExample-body">
            <DefaultButton onClick={this._closeModal} text="Close" />
          </div>
        </Modal>





      </div>
    );
  }

  private _log(str: string): () => void {
    return (): void => {
      console.log(str);
    };
  }


  public changeState = (event: React.FormEvent<HTMLDivElement>, d_item: IDropdownOption): void => {
    console.log('here is the things updating...' + d_item.key + ' ' + d_item.text + ' ' + d_item.selected);
    this.setState({ selectedItem: d_item });
  }


}
