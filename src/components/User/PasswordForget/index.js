import React, { Component, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/CloseSharp'

import { makeStyles } from '@material-ui/styles';
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';

const useStyles = makeStyles(theme => ({
  dialogTitle:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
  },
  icon:{
    float:"right"
  }
}));

const PasswordForgetDialog = (props) => {
  const classes = useStyles();
  return (
    <div>
      <Dialog open={props.open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">         
            Forgot your password?    
          <IconButton onClick={props.onClose} className={classes.icon}>
            <CloseIcon />
          </IconButton>
          </DialogTitle>
          <PasswordForgetForm onClose={props.onClose}/> 
      </Dialog>
    </div>
  );
}

const PasswordForgetFormBase = (props) => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onSubmit = event => {
    props.firebase
      .doPasswordReset(email)
      .then(authUser => props.onClose())
      .catch(error => setError(error));
    event.preventDefault();
  }

  return(
    <form onSubmit={onSubmit}>
      <DialogContent>
      <TextField
          autoFocus          
          margin="normal"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          label="Email Address"
          type="email"
          required
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" color="primary">
          <h3>Sign Up</h3>
        </Button>
      </DialogActions>
        {error && <p>{error.message}</p>}
    </form>
  );
}

const PasswordForgetForm = compose(
  withFirebase,
)(PasswordForgetFormBase);

export default PasswordForgetDialog;

