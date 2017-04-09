import React, { Component } from 'react';
import Datapanel from './subcomp/datapanel';
import Graphpanel from './subcomp/graphpanel'

export default class Home
extends Component {


    constructor(props) {
        super(props);

    }
 
    render() {
        const storez = this.props.checker;
        return (
            <div>
              <Datapanel storez={storez} />
              <Graphpanel />
            </div>
        );
    }
}

