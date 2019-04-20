import React, { Component } from "react";
import axios from "axios";
import SiteTable from './SitesTable';
import { Redirect } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {sites: [], isAuthenticated: this.props.location.state.isAuthenticated, token: this.props.location.state.token};
}

  componentDidMount() {

    if (this.state.isAuthenticated) {
      axios.get("http://127.0.0.1:8000/api/sites/", {
        headers: {
          Authorization: `Token ${this.state.token}`
        }
      }).then(res => {
      console.log(res);
      this.setState({
        sites: res.data
      });
    });
    }else {
      console.log('aaaa')
      // return <Redirect to='http://www.onet.pl' />
    }
    
  }
  render() {
    if (!this.state.isAuthenticated) {
      return (
        <Redirect to='/login' />
      )
    }
    return (
      <div className="containter">
        <SiteTable sites={this.state.sites} />
      </div>
    );
  }
}

export default Home;
