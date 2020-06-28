import React, { useState, useEffect } from 'react';
import { BrowserRouter as Link} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import SingleLineError from '../../Error'
import Grid from '@material-ui/core/Grid'

import { makeStyles } from '@material-ui/styles';
import { withAuthentication, withAuthorization, AuthUserContext} from '../../Session'
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

const AccountDetails = (props) => {


  return(
    <AuthUserContext.Consumer>
      {authUser => (
        !!authUser && <AccountDetailsBase authUser={authUser} firebase={props.firebase}/>
      )}   
    </AuthUserContext.Consumer>  
  );
}

const AccountDetailsBase = (props) => {

  const classes = useStyles();

  const [userFirstName, setUserFirstName     ] = useState('');
  const [userLastName,  setUserLastName      ] = useState('')
  const [addressOne,    setAddressOne       ] = useState('');
  const [addressTwo,    setAddressTwo       ] = useState('');
  const [city,          setCity             ] = useState('');
  const [country,       setCountry          ] = useState('');
  const [code,          setCode             ] = useState('');
  const [phone,         setPhone            ] = useState('');

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setUserFirstName(!!props.authUser.userFirstName ? props.authUser.userFirstName : '') 
    setUserLastName (!!props.authUser.userLastName  ? props.authUser.userLastName  : '') 
    setAddressOne   (!!props.authUser.addressOne    ? props.authUser.addressOne    : '') 
    setAddressTwo   (!!props.authUser.addressTwo    ? props.authUser.addressTwo    : '') 
    setCity         (!!props.authUser.city          ? props.authUser.city          : '') 
    setCountry      (!!props.authUser.country       ? props.authUser.country       : '') 
    setCode         (!!props.authUser.code          ? props.authUser.code          : '') 
    setPhone        (!!props.authUser.phone         ? props.authUser.phone         : '') 

  }, [])

  const onSubmit = event => {
    
    setErrors([]);

    console.log(props.authUser.uid);

    let updates = {
      userFirstName,
      userLastName, 
      addressOne,   
      addressTwo,   
      city,         
      country,      
      code,         
      phone, 
    };

    props.firebase.user(props.authUser.uid).update(updates)
      .catch(err => !err.message && setErrors(arr => [...arr, err]))

    event.preventDefault();
  }

  return(
    <React.Fragment>
      <Grid container className={classes.returningCustomerText}>

        <Grid item xs={3}>
          <div className={classes.returningCustomerText}>
            <Typography variant="h5" > Contact Info </Typography>
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
                label="First Name"
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
                  label="Last Name"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
            {/* <TextField
                autoFocus          
                margin="normal"
                name="addressOne"
                value={addressOne}
                onChange={(e) => setAddressOne(e.target.value)}
                id="addressOne"
                label="Address 1"
                type="text"
                required
                fullWidth
              />
              <TextField
                name="addressTwo"
                value={addressTwo}
                onChange={(e) => setAddressTwo(e.target.value)}
                autoFocus
                margin="normal"
                id="addressTwo"
                label="Address 2"
                type="text"
                required
                fullWidth
              />
              <TextField
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoFocus
                margin="normal"
                id="city"
                label="City"
                type="text"
                required
                fullWidth
              />
              <TextField
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                autoFocus
                margin="normal"
                id="country"
                label="Country"
                type="text"
                required
                fullWidth
              />
               <TextField
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoFocus
                margin="normal"
                id="code"
                label="code"
                type="text"
                required
                fullWidth
              /> */}
               <TextField
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
                margin="normal"
                id="phone"
                label="phone"
                type="text"
                required
                fullWidth
              />
              <Button className={classes.signInButton} type="submit" color="primary">
                Зберегти
              </Button>
          </form>
          </Grid>
            <Grid item xs={3}>
          </Grid>
      </Grid>
    </React.Fragment>
  );

}

const condition = (authUser) => !!authUser

export default compose(withAuthentication, withAuthorization(condition), withFirebase)(AccountDetails);


