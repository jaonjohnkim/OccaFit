import React, { Component } from 'react';
import Activities from './Activities';
import AboutMe from './AboutMe';
import Friends from './Friends';
import ProfilePic from './ProfilePic';
import Setup from './Setup';
import { Container, Card } from 'semantic-ui-react';
import {BrowserRouter as Router} from 'react-router-dom';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			info: null,
			user: null,
			activities: null,
			showModal: false,
			shouldIUpdate: true,
		}
		this.pullAboutMeData = this.pullAboutMeData.bind(this);
	}

	showSetupModal() {
		this.setState({
			showModal: true
		})
	}

	pullAboutMeData() {
		var id = this.props.match.params.id;
		this.props.getAboutMe(id);
  }

  componentWillMount () {
  	var id = this.props.match.params.id;
  		this.props.getUser(id);
  		this.pullAboutMeData();
  		this.getActivities();
  		this.getFriends();
  }



	getActivities() {
		var id = this.props.match.params.id;
		this.props.getUserActivities(id);
	}


	getFriends() {
		var id = this.props.match.params.id;
		this.props.getUserFriends(id);
	}


  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

  user = '/' + this.images[Math.floor(Math.random() * this.images.length)];


	render() {
		return (
			[<Container style={{marginTop: '20px'}} id="profile">
				{this.props.user && this.props.currentProfile
					? <ProfilePic user={this.props.currentProfile} currentUser={this.props.user} name={this.props.currentProfile && this.props.currentProfile.name} checkFriendStatus={this.props.checkFriendStatus} friendStatus={this.props.friendStatus} requested={this.props.requested} accepted={this.props.accepted}/>
					: null
				}
				<Card.Group itemsPerRow={3}>
					<Activities user={this.props.currentProfile} activities={this.props.activities}/>
					<AboutMe user={this.props.currentProfile} loggedIn={this.props.user} info={this.props.info} showSetupModal={this.showSetupModal.bind(this)}/>
					<Friends friends={this.props.friends}/>
				</Card.Group>
			</Container>,
			<Container>
				{this.state.showModal && this.props.history.push('/setup')}
			</Container>]

		)
	}
}

export default Profile;
