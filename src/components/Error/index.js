
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import React, { Component, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/CloseSharp'
import Grid from '@material-ui/core/Grid'


import { makeStyles } from '@material-ui/styles';
import { compose } from 'recompose';
import { classes } from 'istanbul-lib-coverage';
import { typography } from '@material-ui/system';

const useStyles = makeStyles(theme => ({
  errorPaper:{
    borderRadius:0,
    backgroundColor: '#FFBDBD',
    height:40,
    marginBottom:10,
  },
  errorText:{
    align:"center"
  }
}));


const SingleLineError = (props) => {

  const classes = useStyles();

  if(!!props.error)
    return(
      <Paper className={classes.errorPaper} elevation={0}>
        <Typography className={classes.errorText} >{props.error}</Typography>
      </Paper>
    )

  return(null);
}

export default SingleLineError;