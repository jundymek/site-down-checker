import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteSite, refreshSite } from '../../actions/siteActions';
import Loading from '../Loading/Loading'
import './SitesTable.css'


class SiteTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  deleteSite = (id) => {
    const url = `http://127.0.0.1:8000/api/sites/${id}/`
    axios.delete(url, {
      headers: { 'Authorization': `Token ${this.props.token}` }
    })
      .then(() => {
        this.props.deleteSite(id)
        setTimeout(() => alert('Url was deleted'), 1000)
      })
      .catch(error => {
        console.log(error);
      });
  }

  refreshSite = (id, index) => {
    this.setState({loading: true})
    const url = `http://127.0.0.1:8000/api/sites/${id}/`
    axios.put(url, {}, {
      headers: { 'Authorization': `Token ${this.props.token}` }
    })
      .then(response => {
        let data = response.data
        this.props.refreshSite(id, index, data)
        this.setState({loading: false})
      })
      .catch(error => {
        console.log(error);
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
    const siteList = this.props.sites.length
      ? this.props.sites.map((site, index) => {
        return (
          <tr key={site.id}>
            <td>{index + 1}</td>
            <td><Link to={{
              pathname: `/site/${site.id}`,
              state: {
                site: site,
                id: index
              }
            }}>{site.url}</Link></td>
            <td>{site.last_status ? site.last_status : 'None'}</td>
            <td className="mob">{site.last_response_time ? site.last_response_time : 'None'}</td>
            <td className="mob">{site.last_check.slice(0, 16).replace("T", " ")}</td>
            <td><button className="material-icons" onClick={e => this.deleteSite(site.id)}>delete</button></td>
            <td><button className="material-icons" onClick={e => this.refreshSite(site.id, index)}>refresh</button></td>
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
                  <th className="mob">Last response time</th>
                  <th className="mob">Last checked</th>
                </tr>
              </thead>
              <tbody>{siteList}</tbody>
            </table>
            <br />
            <button onClick={this.refreshAll}>Refresh all</button>
          </div>
          {this.state.loading ? <Loading /> : null}
        </div>
      );
    } else {
      return (
        <div className="center">
          No data.
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
