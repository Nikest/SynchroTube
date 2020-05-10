import * as React from 'react';

import { Config, storeInterface } from 'Services';

export class Initializer extends React.Component<{children: any}> {
  componentDidMount() {
    require('Themes/default/theme.scss');

    const theme = Config.get('THEMES');

    document.body.classList.add(`theme-${theme}`);

    window.addEventListener('load', () => {
      storeInterface().setData('windowLoad', true)
    })
  }

  render() {
    return this.props.children
  }
}
