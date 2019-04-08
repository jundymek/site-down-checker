import React, { Component } from "react";
import axios from "axios";
import SiteTable from './SitesTable'

class Home extends Component {
  state = {
    sites: []
  };
  componentDidMount() {
    axios.get("http://127.0.0.1:8000/api/sites/").then(res => {
      console.log(res);
      this.setState({
        sites: res.data
      });
    });
  }
  render() {
    return (
      <div className="containter">
        <SiteTable sites={this.state.sites} />
      </div>
    );
  }
}

export default Home;
