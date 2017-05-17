import React, { Component } from 'react';
import { Header, Box, Title, Button, Anchor, Menu, Label, Columns, Heading, Headline } from 'grommet';
import Recordbtns from './recordbtns'
import { observer, computed } from 'mobx-react'
import Status from 'grommet/components/icons/Status';

@observer
export default class Recordctrl extends Component {

  constructor(props) {
    super(props);

  }

  checkrecord() {
    var isPionline = this.props.checker.PiOnline
    var isConnected = this.props.checker.isConnected
    if (isPionline == true && isConnected == true) {

      return (
        <Box direction='row' pad={{ 'horizontal': 'small', 'vertical': 'none' }} margin='small' align='center'>
          <Heading tag='h4' margin='none'>
            Pi Connection:
            {' '}
            {<Status value='ok' />}
          </Heading>
          <Recordbtns pop={this.props.pop} checker={this.props.checker} socketz={this.props.socketz} />
        </Box>
      )
    } else {
      return (
        <Box direction='row' pad={{ 'horizontal': 'small', 'vertical': 'none' }} margin='small' align='center'>
          <Box pad={{ 'horizontal': 'small' }} margin='none' direction='row'>
            <Heading tag='h4' margin='none'>
              Pi Connection:
              {' '}
              {<Status value='critical' />}
            </Heading>
          </Box>
          <Recordbtns pop={this.props.pop} checker={this.props.checker} socketz={this.props.socketz} />
        </Box>

      )
    }
  }

  render() {
    return (
      <div>
        {this.checkrecord()}
      </div>
      );
  }
}
