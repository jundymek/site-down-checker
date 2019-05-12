import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import axios from 'axios';

class ProxyChangeToggle extends Component {
  state = {
    proxy: true,
  };

  handleChange = () => {
    this.changeProxy()
  };

  changeProxy = () => {
    const url = `http://127.0.0.1:8000/api/proxy/`
    axios.post(url, {}, {
        headers: { 'Authorization': `Token ${this.props.token}` }
    })
        .then(res => {
            this.setState({ proxy: res.data['PROXY'] });
            console.log(res.data['PROXY'])
        })
        .catch(error => {
            console.log(error);
        });
  }

  render() {
    return (
        <FormControlLabel 
          control={
            <Switch
              checked={this.state.proxy}
              onChange={this.handleChange}
              value="proxy"
            />
          }
          label="Proxy"
        />
    );
  }
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
    }
}

export default connect(mapStateToProps)(ProxyChangeToggle);
