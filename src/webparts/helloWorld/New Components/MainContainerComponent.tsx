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
import Utility from '../lib/common';
export default class MainContainerComponent extends React.Component<IMainContainerComponentProps, IMainContainerComponentState, any> {
  private _util = new Utility();
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
          Country: null,
          fileContent: null
        } as IItem
      ] as IItem[],
      editItem: { Company: '', Contact: '', Country: { Id: 0, CountryName: '' }, Id: 0, fileContent: null, isEditable: false }
    } as IMainContainerComponentState;
  }



  private _getSiteColumnData = (id: any): Promise<any> => {
    let web = pnp.sp.web;
    let drpOptions = null;

    // return web.fields.getByTitle("CountryName").get().then(f => {
    //   //console.log(f.Choices);
    //   drpOptions = f.Choices.map((c, i) => ({
    //     key: i,
    //     text: c
    //   })).slice();
    //   return drpOptions;
    // });
    return new Promise((resolve, reject) => {
      web.fields.getByTitle("CountryName").get().then((f) => {
        drpOptions = f.Choices.map((c, i) => ({
          key: i,
          text: c
        })).slice();
        resolve(drpOptions);
      });
    });
  }

  private AsyncAll_Test = (id: any) => {
    return new Promise((resolve, reject) => {
      const list = [1, 2, 3];
      const prs = [];
      list.forEach((i) => {
        let fieldName = null;
        if (i == 1) {
          fieldName = "CountryName";
        } else {
          fieldName = "Categories";
        }
        prs.push(pnp.sp.web.fields.getByTitle(fieldName).get());
      });
      Promise.all(prs).then(f => {
        // console.clear();
        resolve(f);
      });
    });
  }

  //Getting data from site collumn

  private _showModal = async () => {
    console.log('aa');
    const fs = await this.AsyncAll_Test(-1);
    console.log(fs);

    const drpOptions = await this._getSiteColumnData(0);
    console.log('bb');


    // let web = pnp.sp.web;
    // web.fields.getByTitle("CountryName").get().then(f => {
    //   //console.log(f.Choices);
    //   let { drpOptions } = this.state;
    //   drpOptions = drpOptions.concat(...f.Choices.slice().map((c, i) => ({
    //     key: i,
    //     text: c
    //   })));
    //   const editItem: IItem = {
    //     Id: 0, Company: '', Contact: '', Country: { Id: 0, CountryName: '' }, fileContent: null, isEditable: false
    //   };
    //   this.setState({
    //     drpOptions: drpOptions,
    //     editItem
    //   });
    // });


    const editItem: IItem = {
      Id: 0, Company: '', Contact: '', Country: { Id: 0, CountryName: '' }, fileContent: null, isEditable: false
    };

    console.log(drpOptions);


    this.setState({
      drpOptions: [{ key: 0, text: '-Please Select-' }, ...drpOptions.slice()],
      editItem
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
            Id: i.Id,
            Company: i.Company,
            Contact: i.Contact,
            Country: {
              Id: i.CountryId || 0,
              CountryName: i.CountryName
            },
            fileContent: null,
            isEditable: false
          }))
        });
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
        items: items.slice() // Create a new instance suchthat react reflect the change.
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

  private _handleKeyPress(ev: any, id: any) {

    const { items } = this.state;
    //ev.target.value = used to get the text value

    if (ev.key === 'Enter') {

      console.log('do validate');

      this.setState({
        items: items.map((i) => ({
          ...i,
          isEditable: false
        })).slice()
      });
    }

  }




  ////////////////////////////////////////////////////////////////////
  ////////////////////////GRID COMPONENT END /////////////////////////
  ////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////Add New Data in Sharepoint Document Library ////////////
  ////////////////////////////////////////////////////////////////////////////////




  private saveToServer = async (item: IItem) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(item);
        // pnp.sp.web
        //   .getFolderByServerRelativeUrl("Student Details No Content Type")
        //   .files.add(fileContent.name, fileContent, true)
        //   .then(f => {
        //     f.file.getItem().then(item => {
        //       item.update({
        //         Title: "A Title"            
        //       });
        //     });
        //   });
      });
    });
  }
  //Add new Record to sharepoint
  private _addNewRecord_Sharepoint = async () => {
    let { editItem, items } = this.state;
    const result = await this.saveToServer(editItem);
    items = items.concat(result);

    this.setState({
      items: items.slice(),
      editItem: { Id: 0, Company: '', Contact: '', Country: { Id: 0, CountryName: '' }, fileContent: null, isEditable: false },
      showModal: false
    });
  }

  //Setting temp data from textbox
  private handleCommChange = (fieldName: string) => (text: string): void => {
    const { editItem } = this.state;
    this.setState({
      editItem: {
        ...editItem,
        [fieldName]: text
      }
    });
  }

  private handleDrpChange = (event: any) => {
    const { editItem } = this.state;
    const { key, text } = event;
    this.setState({
      editItem: {
        ...editItem,
        Country: {
          Id: parseInt(key),
          CountryName: text

        }
      }
    });
  }

  private _changeFileSelection = (e: any) => {
    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      const { editItem } = this.state;
      const s = this._util.sampleReturn(0);
      this.setState({
        editItem: {
          ...editItem,
          fileContent: e.currentTarget.files[0]
        }
      });
    }
  }

  public render(): React.ReactElement<IMainContainerComponentProps> {
    const { disabled, checked, selectedItem, drpOptions, editItem } = this.state;

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
                          // <input type="text" defaultValue={myitems1.Company} onKeyPress={this._handleKeyPress(myitems1.Id)} />
                          <input type="text" defaultValue={myitems1.Company} onKeyPress={(ev) => this._handleKeyPress(ev, myitems1.Id)} />
                          : <span>{myitems1.Company}</span>}
                      </td>
                      <td>
                        {myitems1.Contact}
                      </td>
                      <td>
                        {myitems1!.Country!.CountryName}
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
              <tr><td>Company</td><td> <TextField value={editItem.Company} onChanged={this.handleCommChange("Company")} /></td></tr>
              <tr><td>Contact</td><td> <TextField value={editItem.Contact} onChanged={this.handleCommChange("Contact")} /></td></tr>
              <tr><td>CountryName</td><td>
                <Dropdown
                  defaultSelectedKey={0}
                  onChanged={this.handleDrpChange}
                  onFocus={this._log('onFocus called')}
                  onBlur={this._log('onBlur called')}
                  placeholder="Select an Option"
                  options={drpOptions}
                />
              </td>
              </tr>
              <tr>
                <td>
                  Upload File
                </td>
                <td>
                  <input
                    type="file"
                    id="uploadFile"
                    onChange={this._changeFileSelection}></input>
                </td>
              </tr>
            </table>
          </div>
          <div id="subtitleId" className="ms-modalExample-body">
            <DefaultButton onClick={this._addNewRecord_Sharepoint} text="Add Record" />
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


}
