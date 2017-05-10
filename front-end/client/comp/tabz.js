import React, {Component} from 'react';
import {Tabs, Tab,} from 'grommet';

export default class Tabz extends Component {
    render() {
        return (
            <div>
                <Tabs responsive={false} activeIndex={0} justify='start'>
                    <Tab title='Live Data'></Tab>
                    <Tab title='Reports'></Tab>
                </Tabs>
            </div>
        );
    }
}
