import React, { Component } from 'react';
import { Box, Label, Tiles, Tile, Header, Heading, Paragraph } from 'grommet';

export default class Calculations extends Component {
  render() {
    return (
      <div>
        <Box colorIndex='neutral-1-a'>
          <Label align='center' size='medium'>Sample Calculations</Label>
        </Box>
        <Tiles flush={false}>
          <Tile separator='top' align='start'>
            <Header size='small' pad={{ "horizontal": "small" }}>
              <Heading tag='h4' strong={true} margin='none'>
                Tile 1
              </Heading>
            </Header>
            <Box pad='small'>
              <Paragraph margin='none'>
                Tile summary content. One or two lines. Tile summary content.
              </Paragraph>
            </Box>
          </Tile>
          <Tile separator='top' align='start'>
            <Header size='small' pad={{ "horizontal": "small" }}>
              <Heading tag='h4' strong={true} margin='none'>
                Tile 2
              </Heading>
            </Header>
            <Box pad='small'>
              <Paragraph margin='none'>
                Tile summary content. One or two lines. Tile summary content.
              </Paragraph>
            </Box>
          </Tile>
          <Tile separator='top' align='start'>
            <Header size='small' pad={{ "horizontal": "small" }}>
              <Heading tag='h4' strong={true} margin='none'>
                Tile 3
              </Heading>
            </Header>
            <Box pad='small'>
              <Paragraph margin='none'>
                Tile summary content. One or two lines. Tile summary content.
              </Paragraph>
            </Box>
          </Tile>
          <Tile separator='top' align='start'>
            <Header size='small' pad={{ "horizontal": "small" }}>
              <Heading tag='h4' strong={true} margin='none'>
                Tile 4
              </Heading>
            </Header>
            <Box pad='small'>
              <Paragraph margin='none'>
                Tile summary content. One or two lines. Tile summary content.
              </Paragraph>
            </Box>
          </Tile>
        </Tiles>
      </div>
      );
  }
}
