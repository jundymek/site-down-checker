import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import AuthenticateCheck from '../hoc/AuthenticateCheck';
import { updateSites } from '../actions/siteActions'

class NewUrl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
        }
    }


    handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://127.0.0.1:8000/api/sites/", {
            url: this.state.url
        }, {
            headers: {'Authorization': `Token ${this.props.token}`}
        })
        .then(response => {
            console.log(response.data)
            this.setState({ url: '' })
            this.props.updateSites(response.data)
            setTimeout(() => alert('New site was added'), 1000)
            
        })
        .catch(error => {
            alert(error)
        });
    }

    checkIfExists = (url) => {
        console.log(this.props.sites.findIndex(url))
    }

    handleChange = (e) => {
        e.preventDefault()
        this.setState({ url: e.target.value })
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <input type="url" required placeholder="Add new url" value={this.state.url} onChange={(e) => this.handleChange(e)} />
                </form>

            </div>
        )
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
  }

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateCheck(NewUrl));
