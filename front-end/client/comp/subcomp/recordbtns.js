import React, { Component } from 'react';
import { observable } from 'mobx';
import { Header, Box, Title, Button, Anchor, Menu, Label, Columns, Heading, Headline, Layer, Form, FormField, TextInput, NumberInput, Footer } from 'grommet';
import TransactionIcon from 'grommet/components/icons/base/Transaction';
import { observer, computed } from 'mobx-react';
import NewIcon from 'grommet/components/icons/base/New';
import StopIcon from 'grommet/components/icons/base/Stop';
import axios from 'axios';


@observer
export default class Recordbtns extends Component {

  @observable isRecording = false
  @observable RecordName = ''
  @observable modalnew = false
  newrname = ''
  interval = 0
  Tinputrecord
  Ninputrecord

  constructor(props) {
    super(props);
    this.addrecord = this.addrecord.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlenuminput = this.handlenuminput.bind(this)
  }

  componentDidMount() {
    this.checkforpi()
  }


  stoprecord() {
    console.log('stoping record')
    var a = this
    axios.put(this.props.checker.apiserver + '/recordcmd/' + 'stop')
      .then(function(response) {

        if (response.data == 'stopped') {
          a.isRecording = false
          a.newrname = ''
          a.interval = 0
          console.log('it ' + response.data)
          console.log('isRecording: ' + a.isRecording)
        }

      })
      .catch(function(error) {
        if (error) {
          console.log(error);
          a.newrname = ''
          a.interval = 0
        }
      });
  }

  addrecord(event) {
    console.log('adding Record')
    event.preventDefault()
    this.modalnew = false
    var b = this;
    if (this.newrname != '' && this.interval >= 1) {
      axios.post(this.props.checker.apiserver + '/records/' + this.newrname + '/' + this.interval.toString())
        .then(function(response) {

          if (response.data == 'added') {
            console.log('Request: record added')
            b.newrname = ''
            b.interval = 0
            b.isRecording = true
          }


        })
        .catch(function(error) {
          if (error) {
            a.newrname = ''
            a.interval = ''
            a.isRecording = false

          }

        });


    } else {
      alert('You did not submit form properly (interval > 0)')
      a.modalnew = false
      a.newrname = ''
      a.interval = 0
      a.isRecording = false
    }
  }


  handleChange(e) {
    this.newrname = e.target.value

  }

  handlenuminput(e) {
    this.interval = e.target.value
  }

  newrecord() {

    if (this.modalnew) {
      return (
        <Layer closer={true} align="center">
          <Box pad='medium'>
            <Form onSubmit={this.addrecord}>
              <Heading tag='h3'>
                New Record
              </Heading>
              <FormField label='Name:'>
                <TextInput onDOMChange={this.handleChange} />
              </FormField>
              <FormField label='Interval (seconds):'>
                <NumberInput defaultValue={0} onChange={this.handlenuminput} />
              </FormField>
              <Footer pad={{ 'vertical': 'medium' }}>
                <Box pad={{ 'horizontal': 'small' }} margin='none' direction='row' align='center'>
                  <Button label='Create' type='submit' primary={true} />
                </Box>
                <Box pad={{ 'horizontal': 'small' }} margin='none' direction='row' align='center'>
                  <Button label='Cancel' type='button' primary={true} onClick={() => {
                                                                                 console.log('cancel')
                                                                                 this.modalnew = false
                                                                                 this.newrname = ''
                                                                                 this.interval = 0
                                                                               
                                                                               }} />
                </Box>
              </Footer>
            </Form>
          </Box>
        </Layer>



      )

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

  getrecord() {
    var isPionline = this.props.checker.PiOnline
    var isConnected = this.props.checker.isConnected
    var a = this

    if (isPionline == true && isConnected == true) {
      console.log('checking isRocrding status via rest api')

      axios.get(this.props.checker.apiserver + '/settingz')
        .then(function(response) {

          response.data.map(function(data) {

            if (data.setname == 'currentrecord') {
              if (data.value != 'none') {
                a.RecordName = data.value
                a.isRecording = true
                console.log(data.value)
                console.log('isRecording: ' + a.isRecording)
              } else {
                a.isRecording = false
                a.RecordName = ''
              }

            }


          })


        })
        .catch(function(error) {
          console.log(error);
        });

      if (this.isRecording == true) {
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
                  {this.RecordName}
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
                                                                      this.modalnew = true
                                                                    }} />
            </Box>
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


  render() {
    return (
      <div>
        {this.getrecord()}
        {this.newrecord()}
      </div>

    )
  }
}
