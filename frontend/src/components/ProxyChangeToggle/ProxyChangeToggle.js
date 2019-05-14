import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import axios from 'axios';

class ProxyChangeToggle extends Component {
  constructor(props) {
    super(props);
    this.url = 'http://127.0.0.1:8000/api/proxy/'
    this.state = {
      proxy: undefined
    }
  }

  componentDidMount() {
    axios.get(this.url, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    }).then(res => {
      console.log(res.data)
      this.setState({proxy: res.data['PROXY']})
    })
  }

  changeProxy = () => {
    axios.post(this.url, {}, {
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
      this.state.proxy !== undefined &&
      <FormControlLabel
        control={
          <Switch
            checked={this.state.proxy}
            onChange={this.changeProxy}
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
