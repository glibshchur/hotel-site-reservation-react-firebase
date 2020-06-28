import React from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import { withFirebase } from '../../Firebase'

const SignOutButton = (props) => 
{
   return(<Button type="button" color="inherit" onClick={props.firebase.doSignOut}>Вийти</Button>);  
};

export default compose(withFirebase)(SignOutButton);