import React, { Component } from "react";
import axios from "axios";
import CustomizedTable from '../SitesTable/SitesTableMaterial';
import NewUrl from '../NewUrl/NewUrl';
import AuthenticateCheck from '../../hoc/AuthenticateCheck';
import { connect } from 'react-redux';
import { updateSites } from '../../actions/siteActions';
import { updateToken } from '../../actions/authenticateActions';
import ProxyChangeToggle  from '../ProxyChangeToggle/ProxyChangeToggle';
import Loading from '../Loading/Loading';
import styled from 'styled-components';

const Container = styled.div`
  width: 95%;
  padding: 5px;
  margin-right: auto;
  margin-left: auto;
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: this.props.sites,
      loading: false
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    if (!this.props.sites.length) {
      axios.get("http://127.0.0.1:8000/api/sites/", {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      }).then(res => {
        this.props.updateSites(res.data)
        this.setState({loading: false})
      });
    } else {
      this.setState({loading: false})
    }
  }

  handleLogout = () => {
    localStorage.clear()
    alert('You were logged out')
    this.props.updateToken()
  }

  render() {
    return (
      <Container>
        <p>You are logged as {localStorage.getItem('username')}</p>
        <button type="submit" onClick={this.handleLogout}>Logout</button>
        <CustomizedTable sites={this.props.sites}/>
        <NewUrl sites={this.props.sites}/>
        <ProxyChangeToggle />
        {this.state.loading ? <Loading /> : null}
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    token: state.token,
    sites: state.sites
  }
}

const mapDispatchToProps = {
  updateSites,
  updateToken,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateCheck(Home));
