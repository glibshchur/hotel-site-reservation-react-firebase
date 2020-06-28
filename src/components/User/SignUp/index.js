import React, { useState } from 'react';
import { BrowserRouter as Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import SingleLineError from '../../Error'
import Grid from '@material-ui/core/Grid'

import { makeStyles } from '@material-ui/styles';
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';

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

const SignUp = (props) => {

  const classes = useStyles();

  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('')
  const [email, setEmail] = useState('');
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [errors, setErrors] = useState([]);

  const onSubmit = event => {
    
    setErrors([]);

    //validate input
    //we need to validate only if the two passwords match
    //the other inputs are validated by firebase rules/material forms
    if(passwordOne != passwordTwo)
      setErrors(arr => [...arr, "Passwords don't match"])
    else
    // Tries to create user in firbase internal db
    // if its successful creates user in the realtime database which is queriable 
    props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        return props.firebase
          .user(authUser.user.uid)
          .set({userFirstName, userLastName, email}); 
          // Only way to make a user admin is from the firebase console
          // Firebase /users/isAdmin path is writable only by other admins
      })
      .then(x => props.history.push('/account'))  //redirect to account page
      .catch(error => !!error.message && setErrors(arr => [...arr, error.message])) // TODO:[Test] might throw some errors that we dont want to display
    
    event.preventDefault();
  }

  return(
    <React.Fragment>
      <Grid container className={classes.returningCustomerText}>

        <Grid item xs={3}>
          <div className={classes.returningCustomerText}>
            <Typography variant="h5" >  </Typography>
          </div>     
        </Grid>

        <Grid item xs={6}>      
          <form onSubmit={onSubmit}>     
            {!!errors && errors.map((err, id) => {
              return(<SingleLineError key={id} error={err}/>)
            })}
            
            <Grid container spacing={2}>
              <Grid item xs={6}>

              <TextField
                name="firstName"
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                type="text"
                autoFocus          
                id="firstName"
                label="Ім'я"
                required
                fullWidth

              />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lastname"
                  value={userLastName}
                  onChange={(e) => setUserLastName(e.target.value)}
                  type="text"
                  autoFocus          
                  id="lastname"
                  label="Прізвище"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
                autoFocus          
                margin="normal"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                label="Електронна Пошта"
                type="email"
                required
                fullWidth
              />
              <TextField
                name="passwordOne"
                value={passwordOne}
                onChange={(e) => setPasswordOne(e.target.value)}
                autoFocus
                margin="normal"
                id="passwordOne"
                label="Пароль"
                type="password"
                required
                fullWidth
              />
              <TextField
                name="passwordTwo"
                value={passwordTwo}
                onChange={(e) => setPasswordTwo(e.target.value)}
                autoFocus
                margin="normal"
                id="passwordTwo"
                label="Повторіть Пароль"
                type="password"
                required
                fullWidth
              />
              <Button className={classes.signInButton} type="submit" color="primary">
                Реєстрація
              </Button>
          </form>
          <Typography className={classes.returningCustomerText} >
            <Link to={'/register'} className={classes.link}>
              Уже зареєстровані? Увійти
            </Link>                 
          </Typography>  
          </Grid>
            <Grid item xs={3}>
          </Grid>
      </Grid>
    </React.Fragment>
  );
}


export default compose(withFirebase)(SignUp);


