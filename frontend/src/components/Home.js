import React, { Component } from "react";
import axios from "axios";
import SiteTable from './SitesTable';
import NewUrl from './NewUrl';
import AuthenticateCheck from '../hoc/AuthenticateCheck';
import { connect } from 'react-redux';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: this.props.sites,
    }
  }
  componentDidMount() {
    if (!this.props.sites.length) {
      axios.get("http://127.0.0.1:8000/api/sites/", {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      }).then(res => {
        this.props.updateSites(res.data)
      });
    } else {
      console.log('Something went wrong')
    }
  }

  refreshSite = (id, index) => {
    console.log(index)
    console.log(id)
    console.log(this.props.token)
    const url = `http://127.0.0.1:8000/api/sites/${id}/`
    axios.put(url, {},{
      headers: { 'Authorization': `Token ${this.props.token}` }
    })
      .then(response => {
        console.log(response.data)
        let data = response.data
        this.props.refreshSite(id, index, data)
      })
      .catch(error => {
        console.log(error)
      });
  }

  handleLogout = () => {
    localStorage.clear()
    alert('You were logged out')
    this.props.updateToken()
  }

  render() {
    return (
      <div className="container">
        <p>You are logged as {localStorage.getItem('username')}</p>
        <button type="submit" onClick={this.handleLogout}>Logout</button>
        <SiteTable sites={this.props.sites} /><br/>
        <NewUrl sites={this.props.sites}/>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    token: state.token,
    sites: state.sites
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      updateSites: (data) => {dispatch({type: 'UPDATE_SITES', data: data})},
      updateToken: () => { dispatch({type: 'UPDATE_TOKEN' })},
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateCheck(Home));
