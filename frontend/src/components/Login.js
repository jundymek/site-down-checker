import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: "", 
            password: "", 
            isAuthenticated: false};
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    handleChange(e, param) {
        e.preventDefault()
        this.setState({[param]: e.target.value})
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
            this.setState({isAuthenticated: true})
            // window.location.reload(); 
          })
          .catch(error => {
            console.log(error.response.statusText);
            alert('Please fill correct credentials')
            this.setState({username: "", password: ""})
          });
        console.log('Submitted')
    }

    render() {
        if (this.state.isAuthenticated) {
            return <Redirect to={{pathname: '/'}}  />
        }
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" required placeholder="Enter username" value={this.state.username} onChange={(e) => this.handleChange(e, 'username')}/>
                    <input type="password" required placeholder="Enter password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default Login