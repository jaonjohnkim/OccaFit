import React, { Component } from 'react';
import Activities from './Activities';
import AboutMe from './AboutMe';
import Friends from './Friends';
import ProfilePic from './ProfilePic';
import Setup from './Setup';
import { Container, Card } from 'semantic-ui-react';

class Profile extends Component {
	constructor(props) {
		console.log('Profile props:', props);
		super(props);
		this.state = {
			info: null,
			details: 'Contact Details',
			activities: null,
			showModal: false
			user: null
		}
	}

	showSetupModal() {
		this.setState({
			showModal: true
		})
		console.log('new state', this.state.showModal)
	}

	checkAuth = () => {
    fetch('/profile', {
      credentials: 'include'
    }).then(response => {
      return response.ok ? response.json() : {};
    }).then(user => {
      if (user && user.name) {
        this.setState({
          user: user,
          authenticated: true
        });
      }
			this.pullAboutMeData();
			this.getActivities();
    });
  }

	pullAboutMeData() {
    console.log('in pullAboutMeData')
    fetch('/profile/about', {credentials: 'include', headers: {user: this.state.user.id}})
		.then(response => {
			console.log('response', response);
			return response.json();
		})
    .then(response => {
			console.log(response)
      this.setState({
				info: response[0]
			})
			console.log('new STATE', this.state.info)
    })
  }

  componentWillMount(){
  	this.checkAuth();
  }

  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];

  user = '/' + this.images[Math.floor(Math.random() * this.images.length)];

	getActivities() {
		console.log('THIS.STATE.USER:', this.state.user);
		fetch('/profile/activities', { credentials: "include", headers: {user: this.state.user.id}})
		.then(resp => resp.json())
		.then(resp => {
			this.setState({ activities: resp });
		});
	}

	render() {
		return (
			[<Container style={{marginTop: '20px'}} id="profile">
				<ProfilePic user={this.user} details={this.state.details}/>
				<Card.Group itemsPerRow={3}>
					<Activities user={this.props.user} activities={this.state.activities}/>
					<AboutMe user={this.props.user} info={this.state.info} showSetupModal={this.showSetupModal.bind(this)}/>
					<Friends />
				</Card.Group>
			</Container>,
			<Container>
				{this.state.showModal && this.props.history.push('/setup')}
			</Container>]
		)
	}
}

export default Profile;
