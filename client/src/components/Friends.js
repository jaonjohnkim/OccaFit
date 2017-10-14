import React, { Component } from 'react';
import { Card, Item } from 'semantic-ui-react';
import FriendEntry from './FriendEntry'

class Friends extends Component {
	constructor(props) {
		super(props);
		this.state = {
			friends: [{name:"david", id:1}, {name:'danny', id:2}],

		}
		this.handleUserClick = this.handleUserClick.bind(this)
	}

	componentDidMount () {
		fetch('/profile/friends', {credentials: 'include'})
		.then(response => {
			return response.json()
		})
		.then(response => {

  		this.setState({
				friends: response
			})
    	})
	}

	handleUserClick (userinfo) {
		//console.log("friend was clicked", userinfo)
	}

	render() {
		return (
			<Card id="friends">
				<Card.Content>
				<Card.Header>Friends</Card.Header>
				</Card.Content>
				<Card.Content>
					<Item.Group divided relaxed>
					{this.props.friends.map((user) =>
						<FriendEntry
						user={user}
						key={user.id}
						handleUserClick={this.handleUserClick}/>
						)}
					</Item.Group>
				</Card.Content>
			</Card>
		)
	}
}

export default Friends;
