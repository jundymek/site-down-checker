import React from 'react';
import Login from '../components/Login/Login';
import { connect } from 'react-redux';

export default function requiresAuth(Component) {
    class AuthenticateCheck extends React.Component {
      render() {
        return (
          <div className="authenticated">
            {localStorage.getItem('token') ? (<Component {...this.props} />) : (<div>
                    <Login {...this.props} />
                </div >)}
          </div>
        );
      }
    }
  
    const mapStateToProps = state => {
      return {
        token: state.token,
        sites: state.sites
      };
    };
  
    return connect(mapStateToProps)(AuthenticateCheck);
  }
