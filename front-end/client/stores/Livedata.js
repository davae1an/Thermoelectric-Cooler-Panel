import {
    observable,
    autorun
} from 'mobx';


class Livedata {
    @observable targetTemp = 10
    @observable isRecording = '';
  	@observable isConnected = 'True';
    @observable tempinside = 0;
    @observable tempoutside = 0;
    @observable temphousing = 0;
    

    @observable peltier = 'ON'
    @observable pump = 'ON'
    @observable radiatorFan = 'ON'
    @observable insideFan = 'ON'


    @observable giffan_playing = true
    @observable giffan_speed = 1


    turnuptemp() {
        // this.targetTemp = this.targetTemp + 0.5
       console.log('Up')
      
    }

    turndowntemp() {
        // this.targetTemp = this.targetTemp - 0.5
       console.log('Down')      
      // this.targetTemp = this.targetTemp - 0.5
       
    }
}

var store = window.store = new Livedata();

export default store

autorun(()=> {
    console.log(store.targetTemp)
})