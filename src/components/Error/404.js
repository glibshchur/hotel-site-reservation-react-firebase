import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';


import Grid from '@material-ui/core/Grid'


import { makeStyles } from '@material-ui/styles';

import { Typography } from '@material-ui/core';



const useStyles = makeStyles(theme => ({
  dialogTitle:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
  },
  icon:{
    float:"right"
  },
  returningCustomerText:{
    marginTop:25,
  },
  signInButton:{
    height:47,
    width:80,
    margin:0,
    color: '#FFFFFF',
    backgroundColor: '#00B4F4',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  },
  errorPaper:{
    borderRadius:0,
    backgroundColor: '#FFBDBD',
    height:70
  },
  errorText:{
    align:"center"
  },
  link:{
    color: '#000000',
    textDecoration: "none",
    '&:hover':{
      color: '#00B4F4',
      textDecoration: "none",
    }
  }
}));



const PageNotFound = (props) => {

  const classes = useStyles();

  return(
    <React.Fragment>

    <Grid container className={classes.returningCustomerText}>
      <Grid item xs={3}>
        <div className={classes.returningCustomerText}>
          <Typography variant="h5" > 404 Page not found </Typography>
        </div>
        
      </Grid>
      <Grid item xs={9}>  

      </Grid>
    </Grid>
    </React.Fragment>
  );

}


export default PageNotFound;