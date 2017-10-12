import React, { Component } from 'react';
import { Card, Image, Segment, Feed, Divider } from 'semantic-ui-react';
// import

class Activities extends Component {
	images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Card>
				<Card.Content>
					<Card.Header>
						Recent Activity
					</Card.Header>
				</Card.Content>
				<Card.Content id='activities'>
					{
						this.props.activities && this.props.activities.attended &&
						this.props.activities.hosted && this.props.activities.attended.length > 0 &&
						this.props.activities.hosted.length > 0 ?

						<Segment>
							{
								this.props.activities && this.props.activities.attended.length > 0 ?
								<span>
									<Divider horizontal> Events {this.props.user && this.props.user.name} is Going To </Divider>
									<Divider />
								</span> : null
							}
							<Feed>
			        {this.props.activities && this.props.activities.attended.map(listing => (
								<Feed.Event>
									<Feed.Label>
										<a><img src={'/' + this.images[Math.floor(Math.random() * this.images.length)]} /></a>
									</Feed.Label>
				          <Feed.Content>
				            <Feed.Date content={listing.date} />
				            <Feed.Summary>
				              <a>{listing.title}</a> at {listing.location} with <a>{listing.name}</a>
				            </Feed.Summary>
				          </Feed.Content>
				        </Feed.Event>
			        ))}
							</Feed>
								{
									this.props.activities && this.props.activities.hosted.length > 0 ?
									<span>
										<Divider />
										<Divider horizontal> Events {this.props.user && this.props.user.name} is Hosting </Divider>
										<Divider />
									</span> : null
								}
							<Feed>
			        {this.props.activities && this.props.activities.hosted.map(listing => (
								<Feed.Event>
									<Feed.Label>
										<a><img src={'/' + this.images[Math.floor(Math.random() * this.images.length)]} /></a>
									</Feed.Label>
				          <Feed.Content>
				            <Feed.Date content={listing.date} />
				            <Feed.Summary>
				              <a>{listing.title}</a> at {listing.location} with {listing.buddies} others
				            </Feed.Summary>
				          </Feed.Content>
				        </Feed.Event>
			        ))}
							</Feed>
						</Segment>
					: <Divider horizontal> No Activity </Divider>
					}
	      </Card.Content>
			</Card>
		)
	}
}

export default Activities;
