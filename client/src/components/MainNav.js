import React, { Component } from 'react';
// import LoginButtonModal from './LoginButtonModal.js';
import { Menu, Button, Dropdown } from 'semantic-ui-react';
import { NavLink, Link, Redirect } from 'react-router-dom';
import NotificationList from './NotificationList.js';

class MainNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: '',
      search: false,
      path: '',
      accepted: null,
      declined: null
    };
    this.searchUser = this.searchUser.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    this.handleDeclineClick = this.handleDeclineClick.bind(this);
    console.log('MAIN NAV:', this)
  }

  getSearchOptions() {
    fetch('/search')
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          options: response
        })
      })
  };

  searchUser(event, data){
    var userId = data.value;
    var newPath = '/profile/' + userId;
    this.setState({path: newPath});
    this.setState({search: true}); 

      this.props.getUser(userId);
      this.props.getUserActivities(userId);
      this.props.getAboutMe(userId);
      this.props.getUserFriends(userId);
      this.props.checkFriendStatus(this.props.user.id, userId);
  };

  changeUser() {
    var id = this.props.user.id;
      this.props.getUser(id);
      this.props.getUserActivities(id);
      this.props.getAboutMe(id);
      this.props.getUserFriends(id);
      this.props.checkFriendStatus(id, this.props.currentProfile.id);
  }

  signOutRedirect = () => {}

  componentDidMount() {
    this.getSearchOptions();
    this.setState({search: false});
  };

  acceptFriendRequest(currentUser, otherUser) {
    var options = {
      credentials: 'include',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user1: otherUser, user2: currentUser})
    };
    fetch('/profile/accept', options);
    this.setState({
      accepted: true
    })
  }

   handleDeclineClick(currentUser, otherUser) {
    var options = {
      credentials: 'include',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user1: otherUser, user2: currentUser})
    };
    fetch('/profile/decline', options);
    this.setState({
      declined: true
    })
  }

  render() {
    return (
      <Menu secondary size='huge' style={{marginBottom: 0}}>
        <Menu.Item exact name='home' as={NavLink} to='/' />
        <Menu.Item name='listings' as={NavLink} to='/listings' />
        <Menu.Item name='about' as={NavLink} to='/about' />
        <Menu.Menu position='right'>
          {!this.props.isAuthed && ([
            <Menu.Item style={{paddingLeft: '0px'}}>
              {/*<Button content='Log In' onClick={this.handleLoginClick} /> */}
              {/*<LoginButtonModal authenticate={this.props.authenticate}/> */}
              <Button as={Link} to='/login' content='Log In' />
            </Menu.Item>,
            <Menu.Item style={{paddingLeft: '0px'}}>
              <Button as={Link} to='/signup' primary content='Sign Up' />
            </Menu.Item>
          ])}

          {this.props.isAuthed && ([
            <Menu.Item>
              <Dropdown placeholder='Search Users' fluid search selection options={this.state.options} style={{width: "250px"}} onChange={this.searchUser}/>
              {this.state.search ? <Redirect push to={this.state.path} /> : null}
            </Menu.Item>,
            <Menu.Item style={{paddingLeft: '0px'}}>
              <Button as={Link} to='/create' primary content='Create Listing' />
            </Menu.Item>,
            <Dropdown text={this.props.user.name} className='link item' pointing>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to='/dashboard'>Dashboard</Dropdown.Item>
                <Dropdown.Item as={Link} to={'/profile/' + this.props.user.id} onClick={this.changeUser}>Profile</Dropdown.Item>
                <Dropdown.Item>Referral</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={this.props.signoff} as={Link} to='/'>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>,
            <Dropdown text="Notifications" className='link item' multiple selection search>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NotificationList user={this.props.user} acceptFriendRequest={this.acceptFriendRequest} handleDeclineClick={this.handleDeclineClick} accepted={this.state.accepted} declined={this.state.declined}/>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ])}
        </Menu.Menu>
      </Menu>
    );
  }
}

export default MainNav;
