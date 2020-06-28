
import React from 'react';
import { compose } from 'recompose';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: JSON.parse(localStorage.getItem('authUser')),
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem('authUser');
          this.setState({ authUser: null });
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return compose(
    withFirebase,
    withRouter,
  )(WithAuthentication);
};

export default withAuthentication;

/*
import React, { useEffect } from 'react';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';








const withAuthentication = Component => {
  const WithAuthentication = (props) => {
    const [authUser, setAuthUser] = React.useState(null);
    const [listener, setListener] = React.useState(null);

    useEffect( () => {
      const setListener = props.firebase.auth.onAuthStateChanged(u => {u ? setAuthUser(u) : setAuthUser(null);} );
    }, []); // 

    return(
    <AuthUserContext.Provider value={authUser}>
      <AuthUserContext.Consumer>
        {authUser => <Component {...props} authUser={authUser}/>}
      </AuthUserContext.Consumer>  
    </AuthUserContext.Provider>  
    );

  }
  return compose(withFirebase)(WithAuthentication);
}

export default withAuthentication;
*/