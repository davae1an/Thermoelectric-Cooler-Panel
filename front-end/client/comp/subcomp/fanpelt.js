import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Legend from 'grommet/components/Legend';
import { observer } from 'mobx-react';

@observer
export default class Fanpelt extends Component {

  constructor(props) {
    super(props);
  }

  fancheck() {
    var isRadiator = this.props.storez.radiatorFan;
    if (isRadiator == 'ON') {
      return (
        <Box size='small' direction='row'>
          <img src={require('../../assets/fanonz.gif')} />
        </Box>
      )
    } else {
      return (
        <Box size='small' direction='row'>
          <img src={require('../../assets/fanoffz.gif')} />
        </Box>
      )
    }
  }

  render() {

    return (
      <div>
        <Box direction='row' justify='start'>
          {this.fancheck()}
          <Box alignSelf='center'>
            <Legend series={[{ 'label': 'Peltier', 'value': this.props.storez.peltier, 'colorIndex': 'graph-1' }, { 'label': 'Pump', 'value': this.props.storez.pump, 'colorIndex': 'graph-3' }, { 'label': 'Rad Fan', 'value': this.props.storez.radiatorFan, 'colorIndex': 'graph-3' }, { 'label': 'Inside Fan', 'value': this.props.storez.insideFan, 'colorIndex': 'graph-3' }, { 'label': 'Housing Fan', 'value': this.props.storez.housingFan, 'colorIndex': 'graph-3' }]} total={false} />
          </Box>
        </Box>
      </div>

      );
  }
}
