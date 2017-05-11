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

class ListStuff {
  @observable listz = []
  @observable visible = false

}

var liststuffz = new ListStuff();

@observer
export default class Reports extends Component {


  constructor(props) {
    super(props);

  }


  componentDidMount() {
    this.populatelist()
  }

  deletedata() {
    console.log('deleting record')
  }

  selectedItem(event) {
    console.log(event)
  }

  populatelist() {
    liststuffz.listz.length = 0
    axios.get(this.props.checker.apiserver + '/records')
      .then(function(response) {
        response.data.map(function(data) {

          liststuffz.listz.push({
            id: data.rec_id,
            name: data.name
          })


        })
      })
      .catch(function(error) {
        console.log(error);
      });
    liststuffz.visible = true
  }


  render() {



    var ListItemz = liststuffz.listz.map(list => (
      <ListItem key={list.id} onClick={this.selectedItem.bind(this)}>
        {list.name}
      </ListItem>))


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
              <Animate visible={liststuffz.visible} enter={{ 'animation': 'fade', 'duration': 1000, 'delay': 0 }} keep={true}>
                <List selectable={true} onSelect={(selected) => {
                                                    console.log(selected)
                                                  }}>
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
                <TableHeader labels={['Name', 'Note']} sortIndex={0} sortAscending={true} />
                <tbody>
                  <TableRow>
                    <td>
                      Alan
                    </td>
                    <td>
                      plays accordion
                    </td>
                  </TableRow>
                  <TableRow>
                    <td>
                      Chris
                    </td>
                    <td>
                      drops the mic
                    </td>
                  </TableRow>
                  <TableRow>
                    <td>
                      Tracy
                    </td>
                    <td>
                      travels the world
                    </td>
                  </TableRow>
                </tbody>
              </Table>
            </Box>
          </Box>
        </Split>
      </div>


    )
  }





}





