import React, { Component } from "react";
import axios from "axios";
import SiteTable from './SitesTable';
import { Redirect } from 'react-router-dom';
import NewUrl from './NewUrl';
import AuthenticateCheck from './AuthenticateCheck';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
    }
  }
  componentDidMount() {
    if (localStorage.getItem('token')) {
      axios.get("http://127.0.0.1:8000/api/sites/", {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      }).then(res => {
        this.setState({
          sites: res.data
        });
      });
    } else {
      console.log('Something went wrong')
    }
  }

  handleLogout = () => {
    localStorage.clear()
    window.location.reload(); 
  }

  render() {
    return (
      <div className="container">
        <p>You are logged as {localStorage.getItem('username')}</p>
        <SiteTable sites={this.state.sites} />
        <button type="submit" onClick={this.handleLogout}>Logout</button>
        <NewUrl sites={this.state.sites}/>
      </div>
    );
  }
}

export default AuthenticateCheck(Home);
