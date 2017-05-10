import { observable, autorun } from 'mobx';


class Livedata {
  @observable targetTemp = 10

  @observable isConnected = false
  @observable PiOnline = true
  @observable tempinside = 0;
  @observable tempoutside = 0;
  @observable temphousing = 0;

  @observable timerasp = ''
  @observable daterasp = ''

  @observable peltier = 'OFF'
  @observable pump = 'OFF'
  @observable radiatorFan = 'OFF'
  @observable insideFan = 'OFF'

  //Api Stuff below
  apiserver = 'http://localhost:3000'



}

var store = window.store = new Livedata();

export default store

autorun(() => {
  console.log(store.targetTemp)
})
