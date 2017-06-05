import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Value, Meter, Label, Headline, Button, RadioButton } from 'grommet';

import Fanpelt from './fanpelt'
import { observer } from 'mobx-react';
import TargetIcon from 'grommet/components/icons/base/Target';
import CaretUpIcon from 'grommet/components/icons/base/CaretUp';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';



@observer
export default class Datapanel extends Component {

  constructor(props) {
    super(props);
  }

  turnuptemp() {
    if (this.props.storez.targetTemp == 40) {

      console.log('Capped at 40 deg')
      var isConnected = this.props.storez.isConnected
      if (isConnected == true) {
        console.log('Sending temp')
        this.props.storez.targetTemp = 40
        this.props.socketz.changetemp()
      // return (<Status value='ok'/>)
      } else {
        console.log('Not Sending not connected')
      // return (<Status value='critical'/>)
      }


    } else {
      console.log('Up')
      var isConnected = this.props.storez.isConnected
      if (isConnected == true) {
        console.log('Sending temp')
        this.props.storez.targetTemp = this.props.storez.targetTemp + 0.5
        this.props.socketz.changetemp()
      // return (<Status value='ok'/>)
      } else {
        console.log('Not Sending not connected')
      // return (<Status value='critical'/>)
      }
    }

  }



  turndowntemp() {
    if (this.props.storez.targetTemp == 0) {

      console.log('Capped at 0')
      var isConnected = this.props.storez.isConnected
      if (isConnected == true) {
        console.log('Sending temp')
        this.props.storez.targetTemp = 0
        this.props.socketz.changetemp()
      // return (<Status value='ok'/>)
      } else {
        console.log('Not Sending not connected')
      // return (<Status value='critical'/>)
      }


    } else {

      console.log('Down')
      var isConnected = this.props.storez.isConnected
      if (isConnected == true) {
        console.log('Sending temp')
        this.props.storez.targetTemp = this.props.storez.targetTemp - 0.5
        this.props.socketz.changetemp()
      // return (<Status value='ok'/>)
      } else {
        console.log('Not Sending not connected')
      // return (<Status value='critical'/>)
      }


    }
  }





  render() {
    return (
      <div>
        <Box colorIndex='grey-2-a' direction='row' justify='start' align='center' pad='small'>
          <Box responsive={false} align='center' margin='small' pad='small'>
            <Meter colorIndex='light-1' type='arc' size='xsmall' value={this.props.storez.tempinside} />
            <Value label='Inside Sensor' value={this.props.storez.tempinside} units='&#8451;' size='small' />
          </Box>
          <Box responsive={false} align='center' margin='small' pad='small'>
            <Meter colorIndex='light-1' type='arc' size='xsmall' value={this.props.storez.tempoutside} />
            <Value label='Outside Sensor' value={this.props.storez.tempoutside} units='&#8451;' size='small' />
          </Box>
          <Box responsive={false} align='center' margin='small' pad='small'>
            <Meter colorIndex='light-1' type='arc' size='xsmall' value={this.props.storez.temphousing} />
            <Value label='Housing Sensor' value={this.props.storez.temphousing} units='&#8451;' size='small' />
          </Box>
          <Box>
            <Fanpelt storez={this.props.storez} />
          </Box>
          <Box flex={true} justify='end' direction='row' responsive={false}>
            <Box direction='row' pad='medium'>
              <Value size='small' value={this.props.storez.targetTemp} label='Target' units='&#8451;' size='large' responsive={true} />
            </Box>
            <Box>
              <Button onClick={this.turnuptemp.bind(this)} icon={< CaretUpIcon size='large' />} />
              <Button onClick={this.turndowntemp.bind(this)} icon={< CaretDownIcon size='large' />} />
            </Box>
          </Box>
        </Box>
      </div>
      );
  }
}
