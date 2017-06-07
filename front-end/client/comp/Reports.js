import React, { Component } from 'react';
import axios from 'axios';
import { Box, Label, Header, Button, TableHeader, Table, TableRow, Layer, Form, FormField, Heading, Footer, TextInput, NumberInput } from 'grommet';
import Split from 'grommet/components/Split';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import TrashIcon from 'grommet/components/icons/base/Trash';
import RefreshIcon from 'grommet/components/icons/base/Refresh';
import { observable, autorun } from 'mobx';
import { observer, computed } from 'mobx-react';
import Animate from 'grommet/components/Animate';
import Recordctrl from './subcomp/recordctrl';
import FileDownload from 'react-file-download';
import { CSVLink, CSVDownload } from 'react-csv';



@observer
export default class Reports extends Component {

  @observable listz = []
  @observable tablerows = []
  @observable visible = false
  @observable modaldelete = undefined
  listid = undefined
  @observable currentrecord = undefined
  selected = 0
  iframeSrc = undefined


  constructor(props) {
    super(props);

  }


  componentDidMount() {
    this.populatelist()
  }

  deletedata(event) {
    event.preventDefault()
    console.log('deleting record')
    var a = this;
    axios.delete(this.props.checker.apiserver + '/records/' + this.listid.toString())
      .then(function(response) {

        if (response.data == 'stopfirst') {
          alert('Please Stop Recording First Before Delete')
          a.populatelist()
        } else {
          a.populatelist()
          a.listid = undefined
          a.currentrecord = undefined
          a.modaldelete = false
        }

      })
      .catch(function(error) {
        if (error) {
          console.log(error);
        }

      });

  }



  modaldeletez() {
    if (this.modaldelete && this.currentrecord != undefined) {
      return (
        <Layer closer={true} align="center">
          <Box pad='medium'>
            <Form onSubmit={this.deletedata.bind(this)}>
              <Heading tag='h3'>
                Delete Record?
              </Heading>
              <Label>
                ID:
                {' '}
                {this.listid}
                {'     '} Name:
                {this.currentrecord}
              </Label>
              <Footer pad={{ 'vertical': 'medium' }}>
                <Box pad={{ 'horizontal': 'small' }} margin='none' direction='row' align='center'>
                  <Button label='Confirm' type='submit' primary={true} />
                </Box>
                <Box pad={{ 'horizontal': 'small' }} margin='none' direction='row' align='center'>
                  <Button label='Cancel' type='button' primary={true} onClick={() => {
                                                                                 console.log('cancel')
                                                                                 this.modaldelete = false
                                                                                 this.listid = undefined
                                                                                 this.currentrecord = undefined
                                                                                 this.populatelist()
                                                                               }} />
                </Box>
              </Footer>
            </Form>
          </Box>
        </Layer>
        );
    }
  }

  selectedItem(id, namez) {
    this.listid = id
    this.currentrecord = namez
    console.log(this.listid)
    console.log(this.currentrecord)
    this.populatetable()
  }

  populatelist() {
    console.log('populating list')
    this.listz.length = 0
    this.tablerows.length = 0
    var a = this;
    axios.get(this.props.checker.apiserver + '/records')
      .then(function(response) {
        response.data.map(function(data) {

          a.listz.push({
            id: data.rec_id,
            name: data.name
          })


        })
      })
      .catch(function(error) {
        console.log(error);
      });
    // this.currentrecord = undefined
    this.visible = true
  }

  populatetable() {
    console.log('populating table')
    var a = this
    if (this.listid != undefined) {
      this.tablerows.length = 0
      axios.get(this.props.checker.apiserver + '/pidata/' + this.listid.toString())
        .then(function(response) {
          response.data.map(function(data) {

            a.tablerows.push({
              id: data.rec_id,
              outside: data.outside,
              inside: data.inside,
              pump: data.pump,
              date: data.date
            })


          })
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  MyIframe() {
    return (
      <div style={{ display: 'none' }}>
        <iframe src={this.props.iframeSrc} />
      </div>
      );
  }

  ExportBtn() {
    if (this.tablerows.length != 0) {
      return (
        <Button label='Export to excel' href={this.props.checker.apiserver + '/export/' + this.listid} />
      )
    }
  }



  render() {




    var ListItemz = this.listz.map(list => (
      <ListItem key={list.id} onClick={this.selectedItem.bind(this, list.id, list.name)}>
        {list.name}
      </ListItem>))

    var TableRowdata = this.tablerows.map(row => (
      <TableRow>
        <td>
          {row.id}
        </td>
        <td>
          {row.outside}
        </td>
        <td>
          {row.inside}
        </td>
        <td>
          {row.pump}
        </td>
        <td>
          {row.date}
        </td>
      </TableRow>))


    return (


      <div>
        <Box colorIndex='neutral-2'>
          <Label align='center' size='medium'>Reports</Label>
          {this.MyIframe}
        </Box>
        <Split flex='right'>
          <Box colorIndex='neutral-4-a' direction='column' pad='small' full='vertical'>
            <Box direction='row'>
              <Button icon={< TrashIcon />} accent={true} onClick={() => {
                                                                     this.modaldelete = true
                                                                   }} />
              <Button icon={< RefreshIcon />} accent={true} onClick={this.populatelist.bind(this)} />
              {this.modaldeletez()}
            </Box>
            <Box colorIndex='light-2'>
              <Animate visible={this.visible} enter={{ 'animation': 'fade', 'duration': 1000, 'delay': 0 }} keep={true}>
                <List selectable={true}>
                  {ListItemz}
                </List>
              </Animate>
            </Box>
          </Box>
          <Box direction='column'>
            <Header size='small' colorIndex='neutral-4'>
              <Recordctrl pop={this.populatelist} checker={this.props.checker} socketz={this.props.socketz} />
              <Box flex={true} justify='end' direction='row' responsive={false}>
                {this.ExportBtn()}
              </Box>
            </Header>
            <Box>
              <Table>
                <TableHeader labels={['ID', 'Outside Temp.', 'Inside Temp.', 'Housing Temp.', 'Time']} />
                <tbody>
                  {TableRowdata}
                </tbody>
              </Table>
            </Box>
          </Box>
        </Split>
      </div>


    )
  }





}





