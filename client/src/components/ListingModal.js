import React, { Component } from 'react';
import { Modal, Header, Button, Image, Icon } from 'semantic-ui-react';

class ListingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requestSent: false
    }
  }

  sendRequest = () => {
    this.setState({
      requestSent: true
    })

    fetch(`/postings/${this.props.listing.id}`, {
      credentials: 'include',
      method: 'POST'
    })
  }

  render() {
    var { listing, open, hideListingModal, userImage, user } = this.props;

    return (
      <Modal open={open} onClose={hideListingModal} closeIcon dimmer='blurring'>
        <Modal.Header>{listing.title}</Modal.Header>

        <Modal.Content image scrolling>
          <Image
            size='small'
            src={userImage}
            wrapped
            shape='circular'
          />

          <Modal.Description>
            <Header>{listing.name}</Header>
            <p>Location: <span>{listing.location}</span></p>
            <p>Meetup point: <span>{listing.meetup_spot}</span></p>
            <p>Date: <span>{new Date(listing.date).toDateString()}</span></p>
            <p>Duration: <span>{listing.duration} hours</span></p>
            <p>Details: <span>{listing.details}</span></p>
          </Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button secondary onClick={hideListingModal}>
            Close <Icon name='close' />
          </Button>
          {user && <Button disabled={this.state.requestSent || listing.status !== null || user.id === listing.ownerId} primary onClick={this.sendRequest}>
            { this.state.requestSent || listing.status ? 'Pending' : 'Request to join' } <Icon name='right chevron' />
          </Button>}
        </Modal.Actions>
      </Modal>
    )
  }

}

export default ListingModal;
