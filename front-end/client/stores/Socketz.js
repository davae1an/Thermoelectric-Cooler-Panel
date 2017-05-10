import io from 'socket.io-client';
import store from './Livedata';

var socket = io('http://localhost:3000');

class Socketz {

  checkpi() {
    //Check if pi connected 
    //look for picheck callback
    socket.emit('picheck', '{ping}')
  }



  changetemp() {
    socket.emit('changetemp', parseFloat(store.targetTemp))
  }

  contoserver() {

    socket.on('connect', function() {
      console.log('Connected to server')

      socket.emit('join', 'React App Connected')
      console.log('Sending to get temp')
      socket.emit('gettemptarget', '{givemetemp}')
      store.isConnected = true

      socket.on('tempdata', function(data) {
        var jsondata = JSON.parse(data);
        store.tempinside = parseFloat(jsondata.tempinside);
        store.temphousing = parseFloat(jsondata.temphousing);
        store.tempoutside = parseFloat(jsondata.tempoutside);
        store.radiatorFan = jsondata.radiatorFan;
        store.peltier = jsondata.peltier;
        store.pump = jsondata.pump;
        store.insideFan = jsondata.insideFan
        console.log('inside: ' + store.tempinside + ' pump: ' + store.temphousing + ' outside: ' + store.tempoutside + ' radiatorFan: ' + jsondata.radiatorFan);
      });

      socket.on('disconnect', function(data) {
        store.isConnected = false
      });

      socket.on('targettemp', function(data) {
        store.targetTemp = parseFloat(data)
      });

      socket.on('reconnect', function(data) {
        store.isConnected = true
      });

      socket.on('join', function(data) {
        console.log('Recieved: ' + data)
      });

      // socket.on('recordinfo', function(data) {
      //   console.log('Recieved: ' + data)
      // });

      socket.on('picheck', function(data) {
        console.log('picheck(rec) : ' + data)
        if (data == 'pong') {
          store.PiOnline = true
        }
      });
    });
  }


}

var socketz = new Socketz();

export default socketz
