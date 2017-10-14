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
      picture: this.props.user.imageUrl
    }

    console.log('PROF PIC:', this);
    this.getImage = this.getImage.bind(this);

  }

  componentDidMount() {
    // currentUser: this.props.currentUser.id,
    // otherUser: this.props.user.id
    this.props.checkFriendStatus(this.props.currentUser.id, this.props.user.id);

    console.log('PROF PIC:', this);

    this.getImage();

  }

  getImage () {

    fetch('/profile/getProfileImage', {credentials: 'include', method: "GET"})
          .then(response=> {
            return response.json();
          })
          .then(response => {
            this.setState({
              picture: response.length && response[0].imageUrl ? response[0].imageUrl : this.state.picture
            })

      })
  }

  sendImage(url) {

  	var info = {url: url}
    console.log("MYNEWIMAGe", info)
  	fetch('/profile/uploadImage', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
          'Content-Type': 'application/json'
        }
    }).then("response from upload image",response => {
      if (response.ok) console.log('request made!');
    })

    window.location.reload();

  }

  //images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
  //pic = '/' + this.images[Math.floor(Math.random() * this.images.length)];

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
      this.props.socket.emit('friendRequestTo', this.props.user.id, resp => console.log('Friend Request Received By Server:', resp));
    }
    this.setState({
      message: 'Request Pending',
      requested: true
    });

  }

  changePicture (url){
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
        src={this.props.user.imageUrl ? this.props.user.imageUrl : '/daniel.jpg'}
        size='small' shape='circular'
        centered style={{margin: 'auto'}}
        onClick={()=> {console.log('got it')}}/>
        <UpdateImage
        	currentUser={this.props.currentUser}
        	user={this.props.user}
        	id='editbutton'
        	changePicture={this.changePicture.bind(this)}
        		sendImage={this.sendImage.bind(this)}/>

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
