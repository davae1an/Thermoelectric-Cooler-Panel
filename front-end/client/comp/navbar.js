import React, { Component } from 'react';
import { observer, computed } from 'mobx-react';
import { Header, Box, Title, Button, Anchor, Menu, Label, Columns } from 'grommet';
import Status from 'grommet/components/icons/Status';
import Edit from 'grommet/components/icons/base/Edit';
import Actions from 'grommet/components/icons/base/Actions';

@observer
export default class Navbar extends Component {

  constructor(props) {
    super(props);
  }

  constatus() {
    var isConnected = this.props.checker.isConnected;
    if (isConnected == 'True') {
      return (<Status value='ok' />)
    } else {
      return (<Status value='critical' />)
    }
  }

  render() {
    return (
      <Header colorIndex='brand'>
        <Title>
          Thermoelectric Cooler
        </Title>
        { this.constatus() }
        <Box flex={ true } justify='end' direction='row' responsive={ false }>
          <Menu icon={ < Actions /> } dropAlign={ { 'right': 'right', 'top': 'top' } }>
            <Anchor href='#' className='active'>
              Reboot
            </Anchor>
            <Anchor href='#'>
              Shutdown
            </Anchor>
          </Menu>
        </Box>
      </Header>
    );
  }
}
