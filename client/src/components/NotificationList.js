import React, { Component } from 'react';
import { Menu, Input, Button, Dropdown, Card } from 'semantic-ui-react';
import NotificationListEntry from './NotificationListEntry.js'

class NotificationList extends Component {
  constructor (props){
    super(props);
    this.state = {
      notifications: []
    }
  }

  getPendingRequests() {
    // fetch('/notification', { credentials: "include", headers: {user: this.props.user.id} })
    //   .then(response => {
    //     return response.json();
    //   })
    //   .then(response => {
    //     this.setState({
    //       notifications: response
    //     })
    //   })
    this.props.getPendingNotifications();
  }

  componentWillMount() {
    this.getPendingRequests();
  }

  render() {
    return (
      <Card.Group>
        {this.props.notifications && this.props.notifications.length > 0 ? this.props.notifications.map(notification => {
          return <NotificationListEntry user={this.props.user} notification={notification} acceptFriendRequest={this.props.acceptFriendRequest} handleDeclineClick={this.props.handleDeclineClick} accepted={this.props.accepted} declined={this.props.declined}/>
        }) : <Card.Content>No Notifications</Card.Content>}
      </Card.Group>
    )
  }
}

export default NotificationList;
