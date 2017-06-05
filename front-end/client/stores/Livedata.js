import { observable, autorun } from 'mobx';


class Livedata {
  @observable targetTemp = 10

  @observable isConnected = false
  @observable PiOnline = false
  @observable tempinside = 0;
  @observable tempoutside = 0;
  @observable temphousing = 0;
  @observable modez = '';

  insidegrid = []
  outsidegrid = []
  housinggrid = []
  timegrid = []

  @observable timerasp = ''
  @observable daterasp = ''

  @observable peltier = 'OFF'
  @observable pump = 'OFF'
  @observable radiatorFan = 'OFF'
  @observable insideFan = 'OFF'
  @observable housingFan = 'OFF'

  //Api Stuff below

  apiserver = 'http://raspberrypi.local:3000'

  // apiserver = 'http://localhost:3000'

}

var store = window.store = new Livedata();

export default store

autorun(() => {
  console.log(store.targetTemp)
})
