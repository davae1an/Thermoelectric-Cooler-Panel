import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Gif from './react-gif'
import Legend from 'grommet/components/Legend';
import {observer} from 'mobx-react';

@observer
export default class Fanpelt extends Component {
   // <Gif src={require('../../assets/fanarrow.gif')} 
   //                 playing={this.props.storez.giffan_playing} 
   //                 speed={this.props.storez.giffan_speed}/> 
   //              </Box>
	constructor(props) {
        super(props);
    }

    fancheck() {
        var isRadiator = this.props.storez.radiatorFan;
        if (isRadiator == 'ON') {
            return (
               <Box size='small' direction='row'>
                  <img src={require('../../assets/fanon.gif')} />
                </Box>
                )
        } else {
            return (
             <Box size='small' direction='row'>
                  <img src={require('../../assets/fanoff.jpg')} />
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
                <Legend series={[
                {'label': 'Peltier', 'value': 'ON', 'colorIndex': 'graph-1'}, 
                {'label': 'Pump', 'value': 'ON', 'colorIndex': 'graph-3'}, 
                {'label': 'Rad Fan', 'value': 'ON', 'colorIndex': 'graph-3'},
                {'label': 'Inside Fan', 'value': 'ON', 'colorIndex': 'graph-3'}
                ]}
                total={false} />
                </Box>
             </Box>
            </div>


        );
    }
}
