import React, { Component } from 'react';
import Datapanel from './subcomp/datapanel';
import Graphpanel from './subcomp/graphpanel'

export default class Home extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    const storez = this.props.checker;
    const socketz = this.props.socketz;
    return (
      <div>
        <Datapanel storez={storez} socketz={socketz} />
        <Graphpanel storez={storez} socketz={socketz} />
      </div>
      );
  }
}
