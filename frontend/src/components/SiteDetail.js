import React, { Component } from 'react';
import axios from 'axios';

class SiteDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: []
        }
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            axios.get(`http://127.0.0.1:8000/api/sites/${this.props.match.params.id}`, {
              headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
              }
            }).then(res => {
              this.setState({
                site: res.data
              });
            });
          } else {
            console.log('Something went wrong')
          }
    }
    render() {
        console.log(this.state.site)
        return (
            <div className="container">
                <h1>{this.state.site.url}</h1>
                <p>Last status: {this.state.site.last_status}</p>
                <p>Last response time: {this.state.site.last_response_time}</p>
                <p>Last check: {this.state.site.last_check}</p>
                <p>Errors: {this.state.site.error_msg}</p>
            </div>
        )
    }
}

export default SiteDetail;