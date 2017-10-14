import React, { Component } from 'react';
import { Menu, Input, Button, Dropdown, Card } from 'semantic-ui-react';

class NotificationListEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: null,
      declined: null
    }
  }

  handleAcceptance() {
    if (!this.state.declined && !this.state.accepted) {
      this.setState({
        accepted: true
      });
      this.props.acceptFriendRequest(this.props.user, this.props.notification);
    }
  }

  handleDecline() {
    if (!this.state.declined && !this.state.accepted) {
      this.setState({
        declined: true
      });
      this.props.handleDeclineClick(this.props.user, this.props.notification)
    }
  }

  render() {
    return (
      <Card color='blue'>
        <Card.Content>
          {this.props.notification && <Card.Description>{this.props.notification.name} sent you a friend request!</Card.Description>}
        </Card.Content>
        <Card.Content>
          <Button.Group size="mini" attached="bottom">
            <Button disabled={this.state.declined} color={this.state.accepted ? 'teal' : 'green'} onClick={() => this.handleAcceptance()}>{this.state.accepted ? 'Accepted!' : 'Accept'}</Button>
            <Button disabled={this.state.accepted} color="red" onClick={() => this.handleDecline()}>{this.state.declined ? 'Declined!' : 'Decline'}</Button>
          </Button.Group>
        </Card.Content>
      </Card>
    )
  }
}

export default NotificationListEntry;
