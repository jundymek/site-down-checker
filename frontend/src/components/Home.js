import React, { Component } from "react";
import axios from "axios";

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
    const { sites } = this.state;
    const siteList = sites.length
      ? (sites.map(function(site, index) {
          return (
            <tr key={site.id}>
              <td>{index + 1}</td>
              <td>{site.url}</td>
            </tr>
          );
        }))
      : null;
    return (
      <div className="containter">
        <div className="center">
          <table className="striped bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Url</th>
              </tr>
            </thead>
            <tbody>{siteList}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Home;
