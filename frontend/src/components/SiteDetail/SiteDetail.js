import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import AuthenticateCheck from '../../hoc/AuthenticateCheck';

class SiteDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site: this.props.location.state ? this.props.location.state.site : '',
            error: false
        }
    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:8000/api/sites/${this.props.match.params.id}/`, {
            headers: {
                Authorization: `Token ${this.props.token}`
            }
        }).then(res => {
            this.setState({
                site: res.data
            });
        }).catch(error => {
            this.setState({ error: true })
        });
    }

    componentWillUnmount() {
        this.setState({
            site: ''
        })
    }

    refreshDetailSite = (id) => {
        const url = `http://127.0.0.1:8000/api/sites/${id}/`
        axios.put(url, {}, {
            headers: { 'Authorization': `Token ${this.props.token}` }
        })
            .then(res => {
                this.setState({
                    site: res.data
                })
                this.props.location.state.site = res.data
            })
            .catch(error => {
                console.log(error);
            });
    }
    render() {
        const error = this.state.site.error_msg.split('\n').map((error, index) => {
            return (
                <p key={index}>{error}</p>
            )
        })

        return !this.state.error ? (
            <div className="container">
                <h1>{this.state.site.url}</h1>
                <p>Last status: {this.state.site.last_status}</p>
                <p>Last response time: {this.state.site.last_response_time}</p>
                <p>Last check: {this.state.site.last_check}</p>
                {/* <p>Errors: {this.state.site.error_msg}</p> */}
                {/* {this.state.site.error_msg.split('\n')} */}
                {error}
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