import React, { Component } from 'react';
import axios from 'axios';

class NewUrl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            sites: this.props.sites,
            newSites: [],
            success: false,
        }
    }

    componentDidMount() {

    }

    handleSubmit = (e) => {
        // e.preventDefault()
        console.log(this.state.url)
        console.log(localStorage.getItem('token'))
        axios.post("http://127.0.0.1:8000/api/sites/", {
            url: this.state.url
        }, {
            headers: {'Authorization': `Token ${localStorage.getItem('token')}`}
        })
        .then(response => {
            console.log(response.data)
            alert('Udało się')
            const newSite = response.data;
            this.setState(prevState => ({
                sites: [...prevState.sites, newSite]
              }))
        })
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

export default NewUrl;
