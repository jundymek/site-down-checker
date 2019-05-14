import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateToken } from '../../actions/authenticateActions';
import { updateSites } from '../../actions/siteActions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    handleChange(e, param) {
        e.preventDefault()
        this.setState({ [param]: e.target.value })
    }

    getNewData(reset) {
        axios.get("http://127.0.0.1:8000/api/sites/", {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        }).then(res => {
            this.props.updateSites(res.data, reset)
        });
    }

    handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/rest-auth/login/', {
            username: this.state.username,
            password: this.state.password
        })
            .then(response => {
                const token = response.data.key;
                localStorage.setItem('username', this.state.username)
                localStorage.setItem('token', token)
                this.props.updateToken()
                this.getNewData(true)
            })
            .catch(error => {
                console.log(error);
                alert('Please fill correct credentials')
                this.setState({ username: "", password: "" })
            });
        console.log('Submitted')
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" required placeholder="Enter username" value={this.state.username} onChange={(e) => this.handleChange(e, 'username')} />
                    <input type="password" required placeholder="Enter password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')} />
                    <button type="submit">Submit</button>
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
    updateToken,
    updateSites
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);