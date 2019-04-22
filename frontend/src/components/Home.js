import React, { Component } from "react";
import axios from "axios";
import SiteTable from './SitesTable';
import { Redirect } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      sites: [], 
      username: localStorage.getItem('username') ? (localStorage.getItem('username')) : (''), 
      token: localStorage.getItem('token') ? (localStorage.getItem('token')) : ('')};
  }

  componentDidMount() {
    if (this.state.username) {
      axios.get("http://127.0.0.1:8000/api/sites/", {
        headers: {
          Authorization: `Token ${this.state.token}`
        }
      }).then(res => {
        this.setState({
          sites: res.data
        });
      });
    } else {
      console.log('Something went wrong')
      // return <Redirect to='http://www.onet.pl' />
    }
  }

  handleLogout = () => {
    localStorage.clear()
    this.setState({username: ''})
  }

  render() {
    if (!this.state.username) {
      return (
        <Redirect to='/login' />
      )
    }
    return (
      <div className="containter">
        <SiteTable sites={this.state.sites} />
        <button type="submit" onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

export default Home;
