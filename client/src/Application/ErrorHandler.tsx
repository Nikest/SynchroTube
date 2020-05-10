import * as React from 'react';

interface IProps {
  children: any;
}

interface IState {
  error: boolean;
}


export class ErrorHandler extends React.Component<IProps, IState> {
  state = {
    error: false,
  };

  componentDidCatch(error, info) {
    this.setState({ error: true });
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if(error) {
      return <div>
        Error
      </div>
    }
    return children
  }
}