import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import store from './stores/Livedata';
import socketz from './stores/Socketz';
import Headerz from './comp/Headerz'
import Tabz from './comp/subcomp/tabz';
import 'grommet/grommet.min.css';
import io from 'socket.io-client';

class App extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
    
      <div className='grommet'>
        <Headerz checker={store} socketz={socketz}/>
      </div>
      
    );
  }

  componentDidMount() {
    socketz.contoserver()
  }

}

render(
  <App/>, document.getElementById('app'));
