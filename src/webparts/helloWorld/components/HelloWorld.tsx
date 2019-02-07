import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps, IHelloWorldState } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';

import MainContainerComponent from './../New Components/MainContainerComponent';



import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';


export default class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState, {}> {

  constructor(props: IHelloWorldProps, state: IHelloWorldState) {
    super(props);
    // Initialize state
    this.state = {
      showModal: false
    };
  }

  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
              <p className={styles.description}>{escape(this.props.description)}</p>

              <div>
                <MainContainerComponent showModal={false} context={this.props.context}  ></MainContainerComponent>
              </div>



            </div>
          </div>
        </div>
      </div>
    );
  }
}
