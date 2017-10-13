import React, { Component } from 'react';
import { Container, Image, List, Button } from 'semantic-ui-react';
import UpdateImage from './UpdateProfileImage.js'

class ProfilePic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Add Friend',
      requested: false,
      status: null,
      picture: this.props.user
    }
  }

  componentDidMount() {
    // currentUser: this.props.currentUser.id, 
    // otherUser: this.props.user.id
    this.props.checkFriendStatus(this.props.currentUser.id, this.props.user.id);
    console.log('PROF PIC:', this);
  }

  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
  pic = '/' + this.images[Math.floor(Math.random() * this.images.length)];

  handleFriendRequests() {
    if (!this.props.requested && !this.props.accepted){
      var options = {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }, 
        method: 'POST',
        body: JSON.stringify({currentUser: this.props.currentUser.id, otherUser: this.props.user.id})
      }
      fetch('/profile/friends', options);
    }
    this.setState({
      message: 'Request Pending',
      requested: true
    });

  }

  changePicture (url){
  	console.log('urrrrrllllll', url)
  	this.setState({
  		picture: url,
  		showModel: false
  	})

  }

  render() {
    return (
      <Container style={{margin: '30px'}}>


        <Image 
        id="profileImage"
        src={this.state.picture} 
        size='small' shape='circular' 
        centered style={{margin: 'auto'}} 
        onClick={()=> {console.log('got it')}}/>
        <UpdateImage changePicture={this.changePicture.bind(this)}/>
        <Container style={{"textAlign": "center"}}>
          <List style={{margin: '10px'}}>
            <List.Item>
              <List.Header>{this.props.name}</List.Header>
              {this.props.user && this.props.user.id !== this.props.currentUser.id
                ? <Button color={this.props.accepted ? 'teal' : this.props.requested || this.state.requested ? 'green' : 'blue'} onClick={() => this.handleFriendRequests()}> {this.props.accepted ? 'Friends' : this.props.requested || this.state.requested ? 'Request Pending' : 'Add Friend'} </Button>
                : null
              }
            </List.Item>
          </List>
        </Container>

      </Container>
    );
  }
}

export default ProfilePic;




