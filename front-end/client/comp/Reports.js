import React, { Component } from 'react';
import axios from 'axios';
import { Box, Label, Header, Button, TableHeader, Table, TableRow } from 'grommet';
import Split from 'grommet/components/Split';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import TrashIcon from 'grommet/components/icons/base/Trash';
import RefreshIcon from 'grommet/components/icons/base/Refresh';
import { observable, autorun } from 'mobx';
import { observer, computed } from 'mobx-react';
import Animate from 'grommet/components/Animate';
import Recordctrl from './subcomp/recordctrl'


@observer
export default class Reports extends Component {

  @observable listz = []
  @observable tablerows = []
  @observable visible = false
  @observable listid = undefined
  selected = 0


  constructor(props) {
    super(props);

  }


  componentDidMount() {
    this.populatelist()
  }

  deletedata() {
    console.log('deleting record')
    var a = this;
    axios.delete(this.props.checker.apiserver + '/records/' + this.listid.toString())
      .then(function(response) {
        a.listid = undefined
        a.populatelist()
      })
      .catch(function(error) {
        console.log(error);
      });

  }



  newrecord() {
    if (Recorddata.modalnew) {
      return (
        <Layer onClose={() => {
                  Recorddata.modalnew = false
                }} closer={true} align="center">
          <Box pad='medium'>
            <Form>
              <Heading tag='h3'>
                New Record
              </Heading>
              <FormField label='Name:'>
                <TextInput />
              </FormField>
              <FormField label='interval(seconds):'>
                <NumberInput defaultValue={1} />
              </FormField>
              <Footer pad={{ 'vertical': 'medium' }}>
                <Button label='Create' type='submit' primary={true} onClick={console.log('sumbit')} />
              </Footer>
            </Form>
          </Box>
        </Layer>
      );
    }
  }

  selectedItem(e) {
    this.listid = e
    console.log(this.listid)
    this.populatetable()
  }

  populatelist() {
    console.log('populating list')
    this.listz.length = 0
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


  render() {



    var ListItemz = this.listz.map(list => (
      <ListItem key={list.id} onClick={this.selectedItem.bind(this, list.id)}>
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
        </Box>
        <Split flex='right'>
          <Box colorIndex='neutral-4-a' direction='column' pad='small' full='vertical'>
            <Box direction='row'>
              <Button icon={< TrashIcon />} accent={true} onClick={this.deletedata.bind(this)} />
              <Button icon={< RefreshIcon />} accent={true} onClick={this.populatelist.bind(this)} />
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
              <Recordctrl checker={this.props.checker} socketz={this.props.socketz} />
            </Header>
            <Box>
              <Table>
                <TableHeader labels={['ID', 'Outside Temp.', 'Inside Temp.', 'Pump Housing Temp.', 'Time']} />
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





