import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';

// Ui Fabric Component 5/Feb/2018
import { css, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { getStyles, IButtonBasicExampleStyleProps, IButtonBasicExampleStyles } from './../uiFabricStyle/Button.Basic.Example.styles';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
// Ui Fabric Component 5/Feb/2018


//Working Module

export default class Buttons extends React.Component<IButtonProps, {}> 
{

  private _alertClicked = (evet, param1): void => {
    alert('Clicked');
  }

  private fetchData = (val: string) => (event: any) => {
    alert(val);
  };


  private get_list_call_from_child = (_id, _title) => {


  }

  public render(): React.ReactElement<IButtonProps> {

    const { disabled, checked } = this.props;

    const getClassNames = classNamesFunction<IButtonBasicExampleStyleProps, IButtonBasicExampleStyles>();
    const classNames = getClassNames(getStyles, {});

    return (
      <div>

        <div className={css(classNames.twoup)}>
          <div>
            <Label>Standard</Label>
            <DefaultButton
              data-automation-id="test"
              disabled={disabled}
              checked={checked}
              text="Button"
              onClick={(e) => this._alertClicked(e, "dfd")}
            />
          </div>
        </div>
      </div>
    );



  }
}
