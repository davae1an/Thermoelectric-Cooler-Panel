import React, {Component} from 'react';
import {Box, Value, Meter, Label, Headline} from 'grommet';
import {observer} from 'mobx-react';
import TargetIcon from 'grommet/components/icons/base/Target';

@observer
export default class Datapanel extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Box colorIndex='light-2' direction='row' justify='start' align='center' wrap={true} pad='medium'>
                    <Box>
                        Inside Sensor
                        <Value size='small' value={this.props.TempStore.tempinside} units='&#8451;' align='start'/>
                        <Meter size='small' value={this.props.TempStore.tempinside} type='arc'/>
                    </Box>

                    <Box>
                        Outside Sensor
                        <Value size='small' value={this.props.TempStore.tempoutside} units='&#8451;' align='start'/>
                        <Meter size='small' value={this.props.TempStore.tempoutside} type='arc'/>
                    </Box>

                    <Box>
                        Pump Sensor
                        <Value size='small' value={this.props.TempStore.temphousing} units='&#8451;' align='start'/>
                        <Meter size='small' value={this.props.TempStore.temphousing} type='arc'/>
                    </Box>

                    <Box direction='row' justify='end' align='center' wrap={true} pad='medium' margin='small' flex={true}  responsive={false}>
                        <Value size='small' value={this.props.TempStore.targetTemp} icon={< TargetIcon size = 'large' />} label='Traget' units='&#8451;' size='large' responsive={true}/>
                    </Box>
                </Box>

            </div>
        );
    }
}


