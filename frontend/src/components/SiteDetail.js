import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import AuthenticateCheck from '../hoc/AuthenticateCheck';

class SiteDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: this.props.location.state ? this.props.location.state.site : '',
            error: false
        }
    }

    componentDidMount() {
        if (!this.state.site) {
            axios.get(`http://127.0.0.1:8000/api/sites/${this.props.match.params.id}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            }).then(res => {
                this.setState({
                    site: res.data
                });
            }).catch(error => {
                this.setState({ error: true })
            });
        }
    }

    refreshDetailSite = (id) => {
        const url = `http://127.0.0.1:8000/api/sites/${id}/`
        axios.put(url, {}, {
            headers: { 'Authorization': `Token ${this.props.token}` }
        })
            .then(response => {
                let data = response.data
                this.setState({
                    site: {
                        'url': data.url,
                        'last_response_time': data.last_response_time,
                        'last_status': data.last_status,
                        'last_check': data.last_check,
                        'id': data.id,
                        'error_msg': data.error_msg
                    }
                })
            })
            .catch(error => {
                console.log(error);
            });
    }
    render() {

        return !this.state.error ? (
            <div className="container">
                <h1>{this.state.site.url}</h1>
                <p>Last status: {this.state.site.last_status}</p>
                <p>Last response time: {this.state.site.last_response_time}</p>
                <p>Last check: {this.state.site.last_check}</p>
                <p>Errors: {this.state.site.error_msg}</p>
                <button onClick={e => this.refreshDetailSite(`${this.state.site.id}`)}>Refresh</button>
            </div>
        ) : (
                <Redirect to={{ pathname: '/*' }} />
            )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        sites: state.sites
    }
}

export default connect(mapStateToProps)(AuthenticateCheck(SiteDetail));