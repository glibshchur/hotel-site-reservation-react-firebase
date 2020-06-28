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
      backgroundColor: '#68e022'
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
    color:"#000000",
    textDecoration: "none",
  },
  footer:{
    width:`calc(100% - 225px)`,
    marginLeft:225,
    height:200,
    backgroundColor:"#38f25d",
    textAlign: 'center',
  },
  footerTop:{
    width:`calc(100% - 225px)`,
    marginLeft:225,
    height:200,
    color:"#FFFFFF",
    backgroundColor:"#2C2A2B",
    justify:"center",
    align:"center",
    textAlign: 'center',
  },

}));



const Footer = (props) => {

  const classes = useStyles();

  return(
    <React.Fragment>

    <Grid container className={classes.footer} alignItems="center">
      <Grid item xs={3} className={classes.footerContent}>  
        <Typography> +380 12 345 67 89  </Typography>
        <Typography> bestforrest@gmail.com</Typography>
      </Grid>
      <Grid item xs={3}>  
      <Typography> 
            <Link to ={'/contact'} className={classes.link}> 
            Про нас
            </Link>  
          </Typography>
      </Grid>
      <Grid item xs={3}>  
        <Typography> 
            <Link to ={'/register'} className={classes.link}> 
            Зареєструватися
            </Link>  
          </Typography>
        <Typography> 
          <Link to = {'/login'} className={classes.link}> 
          Увійти
          </Link>  
        </Typography>
      </Grid>
    </Grid>

    </React.Fragment>
  );

}


export default Footer;