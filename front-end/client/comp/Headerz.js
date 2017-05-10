import React, {Component} from 'react';
import Status from 'grommet/components/icons/Status';
import Edit from 'grommet/components/icons/base/Edit';
import Actions from 'grommet/components/icons/base/Actions';
import Home from './Home'
import Calculations from './Calculations'
import About from './About'
import Reports from './Reports'
import {observer, computed} from 'mobx-react';
import {
  Header,
  Box,
  Title,
  Button,
  Anchor,
  Menu,
  Label,
  Columns
} from 'grommet';
import {HashRouter as Router, Route, Link, NavLink, hashHistory} from 'react-router-dom'

@observer
export default class Headerz extends Component {

  constructor(props) {
    super(props);
    console.log('checking: ' + this.props.checker.isConnected)
  }

  constatus() {
    var isConnected = this.props.checker.isConnected;
    if (isConnected == true) {
      return (<Status value='ok'/>)
    } else {
      return (<Status value='critical'/>)
    }
  }

  render() {
    return (
      <Router history={hashHistory}>
        <div>
          <div>
            <Header size='small' colorIndex='brand'>
              <Title>

                Thermoelectric Cooler {this.constatus()}
              </Title>

              <Box pad={{
                'between': 'medium'
              }} flex={true} justify='end' direction='row' responsive={false}>

                <Menu direction='row' size='small' dropAlign={{
                  'right': 'right'
                }}>

                  <Anchor path='/'>Home</Anchor>
                  <Anchor path='/calculations'>Calculations</Anchor>
                  <Anchor path='/reports'>Reports</Anchor>
                  <Anchor path='/about'>About</Anchor>

                </Menu>
              </Box>

              <Box flex={true} justify='end' direction='row' responsive={false}>

                <Menu icon={< Actions />} dropAlign={{
                  'right': 'right',
                  'top': 'top'
                }}>
                  <Anchor href='#' className='active'>
                    Reboot
                  </Anchor>
                  <Anchor href='#'>
                    Shutdown
                  </Anchor>
                </Menu>
              </Box>
            </Header>
          </div>

          <Route exact path="/" render={() => <Home checker={this.props.checker} socketz = {this.props.socketz}/>}/>
          <Route path="/calculations" component={Calculations}/>
          <Route path="/about" component={About}/>
          <Route path="/reports" render={() => <Reports checker={this.props.checker} socketz = {this.props.socketz}/>}/>

        </div>
      </Router>

    );
  }
}
