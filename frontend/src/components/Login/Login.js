import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    handleChange(e, param) {
        e.preventDefault()
        this.setState({ [param]: e.target.value })
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

const mapDispatchToProps = (dispatch) => {
    return {
        updateToken: () => { dispatch({ type: 'UPDATE_TOKEN' }) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);