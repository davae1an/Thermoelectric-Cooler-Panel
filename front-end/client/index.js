import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import store from './stores/Livedata';
import Headerz from './comp/Headerz'
import Tabz from './comp/subcomp/tabz';
import 'grommet/grommet.min.css';
import io from 'socket.io-client';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'


class App extends React.Component {

    constructor(props) {
        super(props)
            // const store = new Livedata();
    }

    render() {
        return (
        <div className='grommet'>    
           <Headerz checker={store}/>
        </div>  
        );
    }

    componentDidMount() {

        var socket = io('http://raspberrypi.local:3000');
        socket.on('connect', function() {
            console.log('Connected to server')
            socket.emit('join', 'React App Connected')
            console.log('Sending to get temp')
            socket.emit('gettemptarget', '{givemetemp}')
                // ulit.isConnected = 'True'

            socket.on('tempdata', function(data) {
                var jsondata = JSON.parse(data);
                store.tempinside = parseFloat(jsondata.tempinside);
                store.temphousing = parseFloat(jsondata.temphousing);
                store.tempoutside = parseFloat(jsondata.tempoutside);
                store.radiatorFan = jsondata.radiatorFan;
                console.log('inside: ' + store.tempinside + ' pump: ' + store.temphousing + ' outside: ' + store.tempoutside + ' radiatorFan: ' + jsondata.radiatorFan);
            });

            socket.on('disconnect', function(data) {
                store.isConnected = 'False'
            });

            socket.on('targettemp', function(data) {
                store.targetTemp = parseFloat(data)
            });

            socket.on('reconnect', function(data) {
                store.isConnected = 'True'
            });

            socket.on('join', function(data) {
                console.log('Recieved: ' + data)
            });
        });

    }

}

render(
    <App/>, document.getElementById('app'));
