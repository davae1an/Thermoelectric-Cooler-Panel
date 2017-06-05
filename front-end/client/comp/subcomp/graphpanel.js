import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, autorun } from 'mobx';
import { Box, Value, Meter, Label, Headline, Button } from 'grommet';
import { Line, defaults } from 'react-chartjs-2';

const options = {
  responsive: false,
  title: {
    display: true,
    text: 'Live Temperature Data Analysis',
    fontSize: 20
  },
  tooltips: {
    mode: 'label'
  },
  scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Temperature',
        fontSize: 15
      }
    }],
    xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Time',
        fontSize: 15
      }
    }],


  }
};




defaults.global.animationSteps = 15;



export default class Graphpanel extends Component {

  data = {
    labels: this.props.storez.timegrid,

    datasets: [
      {
        label: 'Inside Temp',
        fill: true,
        lineTension: 0.4,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: this.props.storez.insidegrid

      },
      {
        label: 'Outside Temp',
        fill: true,
        lineTension: 0.4,
        backgroundColor: 'rgba(255,106,0,0.2627450980392157)',
        borderColor: 'rgba(255,106,0,1.0)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(255,106,0,1.0)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(255,106,0,1.0)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: this.props.storez.outsidegrid

      },
      {
        label: 'Housing Temp',
        fill: true,
        lineTension: 0.4,
        backgroundColor: 'rgba(33,0,127,0.5411764705882353)',
        borderColor: 'rgba(33,0,127,0.8313725490196079)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(33,0,127,0.8313725490196079)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(33,0,127,0.8313725490196079)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: this.props.storez.housinggrid

      }
    ]
  };

  constructor(props) {
    super(props);
  }

  updatechart() {
    var tchart = this.refs.tempchart.chart_instance
    // var latestLabel = tchart.data.labels[6]
    // tchart.data.labels.push(++tchart.data.labels[6])

    // tchart.data.datasets[0].data.push(Math.random() * 100)
    // tchart.data.datasets[1].data.push(Math.random() * 100)
    // tchart.data.datasets[2].data.push(Math.random() * 100)




    // if (tchart.data.labels.length >= 10) {
    //   // shift() removes first row of array
    //   tchart.data.labels.shift()
    //   tchart.data.datasets[0].data.shift()
    //   tchart.data.datasets[1].data.shift()
    //   tchart.data.datasets[2].data.shift()

    // }


    tchart.update()
  }

  componentDidMount() {
    console.log(this.refs.tempchart.chart_instance);
    this.interval = setInterval(() => this.updatechart(), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <Box colorIndex='light-1' direction='row' justify='start' align='center' pad='small' size='large'>
          <Line ref='tempchart' data={this.data} options={options} height={300} width={1200} />
        </Box>
      </div>


      );
  }
}
