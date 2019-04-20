import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "", isAuthenticated: false, token: "" };
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
        console.log(this.state.username)
        axios.post('http://127.0.0.1:8000/rest-auth/login/', {
            username: this.state.username,
            password: this.state.password
          })
          .then(response => {
            const token = response.data.key;
            this.setState({isAuthenticated: true, token: token});
          })
        //   .then(function (response) {
        //     console.log(response.data.key)
        //     const token = response.data.key
        //     this.setState({isAuthenticated: true, token: token})
        //     console.log(this.state)
        //   })
          .catch(error => {
            console.log(error.response.statusText);
            alert('Zle dane')
            this.setState({username: "", password: ""})
          });
        console.log('Submittedaaa')
    }

    render() {
        if (this.state.isAuthenticated) {
            return <Redirect to={{pathname: '/', state:{token: this.state.token, isAuthenticated: true}}} />
        }
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Enter username" value={this.state.username} onChange={(e) => this.handleChange(e, 'username')}/>
                    <input type="password" placeholder="Enter password" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default Login