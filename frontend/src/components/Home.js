import React, { Component } from "react";
import axios from "axios";
import SiteTable from './SitesTable';
import NewUrl from './NewUrl';
import AuthenticateCheck from '../hoc/AuthenticateCheck';
import { connect } from 'react-redux'

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
    alert('You were logged out')
    this.props.updateToken()
  }

  render() {
    console.log(this.props)
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
const mapStateToProps = (state) => {
  return {
    token: state.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      updateToken: () => { dispatch({type: 'UPDATE_TOKEN' })}
  } 
}
export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateCheck(Home));
