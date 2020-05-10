import * as React from 'react';

import { ErrorHandler } from './ErrorHandler';
import { Initializer } from './Initializer';
import { Core } from 'Core';
import { Modal } from 'Modal';

export class Application extends React.Component {
  render() {
    return (
      <ErrorHandler>
        <Initializer>
          <Core/>
          <Modal/>
        </Initializer>
      </ErrorHandler>
    )
  }
}
