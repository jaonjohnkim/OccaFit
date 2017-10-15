import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';

import WorkoutDropdown from './WorkoutDropdown';

class Workouts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card.Group itemsPerRow={3}>
        {this.props.data.map(listing => (
          <Card>
            <Card.Content>
              <Image src={this.props.user} size='mini' floated='left'/>
              <Card.Header>{listing.title}</Card.Header>
              <Card.Meta>{listing.location}</Card.Meta>
              <Card.Description>{`${listing.details} on ${listing.date} for ${listing.duration} hour(s)`}</Card.Description>
              <Card.Content extra>
                <WorkoutDropdown postingId={listing.id} buddies={listing.buddies} update={this.props.update} dataPull={this.props.dataPull} />
              </Card.Content>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    )
  }

}

export default Workouts;
