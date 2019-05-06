import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteSite, refreshSite } from '../actions/siteActions';


class SiteTable extends Component {
  constructor(props) {
    super(props);
  }

  deleteSite = (id) => {
    console.log(id)
    console.log(this.props.token)
    const url = `http://127.0.0.1:8000/api/sites/${id}/`
    axios.delete(url, {
      headers: { 'Authorization': `Token ${this.props.token}` }
    })
      .then(response => {
        console.log(response.data)
        this.props.deleteSite(id)
        setTimeout(() => alert('Url was deleted'), 1000)
      })
      .catch(error => {
        console.log(error)
      });
  }

  refreshSite = (id, index) => {
    console.log(index)
    console.log(id)
    console.log(this.props.token)
    const url = `http://127.0.0.1:8000/api/sites/${id}/`
    axios.put(url, {}, {
      headers: { 'Authorization': `Token ${this.props.token}` }
    })
      .then(response => {
        console.log(response.data)
        let data = response.data
        this.props.refreshSite(id, index, data)
      })
      .catch(error => {
        console.log(error)
      });
  }

  refreshAll = () => {
    for (let i = 0; i < this.props.sites.length; i++) {
      let id = this.props.sites[i]['id']
      let index = i
      this.refreshSite(id, index)
    }
  }

  render() {
    console.log(this.props.sites)
    const siteList = this.props.sites.length
      ? this.props.sites.map((site, index) => {
        console.log(this.props.sites)
        return (
          <tr key={site.id}>
            <td>{index + 1}</td>
            <td><Link to={`/site/${site.id}`}>{site.url}</Link></td>
            <td>{site.last_status ? site.last_status : 'None'}</td>
            <td>{site.last_response_time ? site.last_response_time : 'None'}</td>
            <td>{site.last_check.slice(0, 16).replace("T", " ")}</td>
            <td><button onClick={e => this.deleteSite(`${site.id}`)}>Delete</button></td>
            <td><button onClick={e => this.refreshSite(`${site.id}`, index)}>Refresh</button></td>
          </tr>
        );
      })
      : null;
    if (siteList) {
      return (
        <div className="containter">
          <div className="center">
            <table className="striped bordered">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Url</th>
                  <th>Last status</th>
                  <th>Last response time</th>
                  <th>Last checked</th>
                </tr>
              </thead>
              <tbody>{siteList}</tbody>
            </table>
            <br />
            <button onClick={this.refreshAll}>Refresh all</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="center">
          <p>No data</p>
        </div>
      );
    }
  }
}


const mapStateToProps = (state) => {
  return {
    token: state.token,
    sites: state.sites
  }
}

const mapDispatchToProps = {
  deleteSite, 
  refreshSite, 
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteTable);
