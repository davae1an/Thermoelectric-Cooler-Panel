import React, { Component } from 'react';
import { observable, autorun } from 'mobx';
import { Header, Box, Title, Button, Anchor, Menu, Label, Columns, Heading, Headline, Layer, Form, FormField, TextInput, NumberInput, Footer } from 'grommet';
import TransactionIcon from 'grommet/components/icons/base/Transaction';
import { observer, computed } from 'mobx-react';
import NewIcon from 'grommet/components/icons/base/New';
import StopIcon from 'grommet/components/icons/base/Stop';
import axios from 'axios';

// I never understood forms so hacked through it with states =p
class Recordinfo {
  @observable isRecording = false
  RecordName = ''
  @observable modalnew = false
  newrname = ''
  interval = ''
}

var Recorddata = new Recordinfo();


@observer
export default class Recordbtns extends Component {


  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.checkforpi()
  }


  stoprecord() {
    console.log('stoping record')
    axios.put(this.props.checker.apiserver + '/recordcmd/' + 'stop')
      .then(function(response) {

        if (response = 'stopped') {
          Recorddata.isRecording = false
          console.log('it ' + response)
        }

      })
      .catch(function(error) {
        console.log(error);
      // Recorddata.modalnew = false
      });
  }

  addrecord() {
    // event.preventDefault()
    if (Recorddata.newrname != '' && Recorddata.interval != '') {
      if (Recorddata.newrname != '' && Recorddata.interval >= 1) {
        axios.post(this.props.checker.apiserver + '/records/' + Recorddata.newrname + '/' + Recorddata.interval.toString())
          .then(function(response) {
            Recorddata.newrname = ''
            Recorddata.interval = ''
            Recorddata.modalnew = false
            // a.props.pop()

          })
          .catch(function(error) {
            console.log(error);
            Recorddata.modalnew = false
            Recorddata.newrname = ''
            Recorddata.interval = ''
          });

      }
    } else {
      console.log('You did not submit form properly')
      Recorddata.modalnew = false
      Recorddata.newrname = ''
      Recorddata.interval = ''
    }
  }

  newrecord() {

    if (Recorddata.modalnew) {
      if (Recorddata.isRecording == false) {
        return (
          <Layer onClose={() => {
                  Recorddata.modalnew = false
                  Recorddata.newrname = ''
                  Recorddata.interval = ''
                
                }} closer={true} align="center">
            <Box pad='medium'>
              <Form onSubmit={this.addrecord.bind(this)}>
                <Heading tag='h3'>
                  New Record
                </Heading>
                <FormField label='Name:'>
                  <TextInput id='namez' onDOMChange={(event) => {
                                                       Recorddata.newrname = event.target.value
                                                     }} />
                </FormField>
                <FormField label='interval(seconds):'>
                  <NumberInput id='intervalz' defaultValue={0} onChange={(event) => {
                                                                           Recorddata.interval = event.target.value
                                                                         }} />
                </FormField>
                <Footer pad={{ 'vertical': 'medium' }}>
                  <Button label='Create' type='submit' primary={true} />
                </Footer>
              </Form>
            </Box>
          </Layer>
          );
      }
    }
  }

  checkforpi() {
    if (this.props.checker.isConnected == true) {
      console.log('sending ping to pi')
      this.props.socketz.checkpi()
    } else {
      console.log('Cannot ping not connected to server')
    }
  }


  render() {
    var isPionline = this.props.checker.PiOnline
    var isConnected = this.props.checker.isConnected

    if (isPionline == true && isConnected == true) {
      console.log('checking isRocrding status via rest api')

      axios.get(this.props.checker.apiserver + '/settingz')
        .then(function(response) {

          response.data.map(function(data) {

            if (data.setname == 'currentrecord') {
              if (data.value != 'none') {
                Recorddata.RecordName = data.value
                Recorddata.isRecording = true
                console.log(data.value)
              } else {
                Recorddata.isRecording = false
                Recorddata.RecordName = ''
              }

            }


          })


        })
        .catch(function(error) {
          console.log(error);
        });

      if (Recorddata.isRecording == true) {
        return (
          <div>
            <Box pad={{ 'horizontal': 'small' }} margin='none' direction='row' align='center'>
              <Box pad={{ 'horizontal': 'small' }} margin='none' direction='row' align='center'>
                <Heading tag='h4' margin='none'>
                  Recording:
                  {' '}
                </Heading>
                <Box pad={{ 'horizontal': 'small' }} margin='none' direction='row' align='center'>
                  <Button label='Stop' icon={<StopIcon/>} onClick={this.stoprecord.bind(this)} />
                </Box>
                <Heading tag='h4' margin='none'>
                  Name:
                  {' '}
                  {Recorddata.RecordName}
                </Heading>
              </Box>
            </Box>
          </div>
        )

      } else {

        return (
          <div>
            <Box pad={{ 'horizontal': 'small' }} margin='none'>
              <Button label='New Record' icon={<NewIcon/>} onClick={() => {
                                                                      Recorddata.modalnew = true
                                                                    }} />
            </Box>
            {this.newrecord()}
          </div>

        )

      }


    } else {

      return (
        <div>
          <Box pad={{ 'horizontal': 'small' }} margin='none'>
            <Button label='check' icon={<TransactionIcon />} onClick={this.checkforpi.bind(this)} />
          </Box>
        </div>
        );

    }





  }
}
