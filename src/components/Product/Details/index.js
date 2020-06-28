import React, { Component, useState, useEffect, isValidElement } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {DropzoneArea} from 'material-ui-dropzone'

import Checkbox from '@material-ui/core/Checkbox'
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid'
import { withAuthorization, withAuthentication, AuthUserContext } from '../../Session';
import { makeStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { debug } from 'util';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import SingleLineError from '../../Error'
import { Typography, Paper } from '@material-ui/core';
import NullImage from '../No-Image-Available.jpg';
import NullImage1 from '../ni.jpeg';

//<Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>

const useStyles = makeStyles(theme => ({

  directorySubtitle:{
    fontSize:12,
    marginTop:10,
    marginBottom:20
  },

  description:{
    marginTop:10,
    marginBottom:20,
    fontSize:15,
  },

  previewImage:{
    width:'100%',
  },
  secondaryImage:{
    width:'100%',
  },
  spacer:{
    height:20
  },
  errorDiv:{
    marginTop:55,
  },
  title:{
    marginTop:50,
    marginBottom:50,
  },
  editButton:{   
    marginTop:50, 
    height:47,
    color: '#FFFFFF',
    backgroundColor: '#00B4F4',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  },
  cartButton:{
    height:47,
    width:300,
    color: '#FFFFFF',
    backgroundColor: '#00B4F4',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  },
  contentPaper:{
    marginLeft:25,
    marginTop:0
  },
  link:{
    textDecoration: "none",
  }
}));

// TODO: [Feature] Add support for categories without subCategories
const ProductDetails = (props) => {

  const classes = useStyles();
  const categoryRef = props.firebase.categoryRef();
  const storageRef = props.firebase.storage;


  const [previewImage, setPreviewImage] = React.useState(NullImage);
  const [subImageOne, setSubImageOne] = React.useState(NullImage);
  const [subImageTwo, setSubImageTwo] = React.useState(NullImage);
  const [product, setProduct] = React.useState(null);

    // Store the cart data in browser storage
  // There's no reason for it to be stored in the db for now
  const addItemToCart = (product) => {
    let cart = localStorage.getItem('cart');
    let cartObj = !!cart && !!JSON.parse(cart) ? JSON.parse(cart) : [];


    let productId = cartObj.findIndex(x => x.key == props.match.params.productId);

    if(productId == -1)
      cartObj.push({...product, key:props.match.params.productId});

    console.log(cartObj);

    localStorage.setItem('cart',  JSON.stringify(cartObj))
  }

  useEffect(() => {
    


    //TODO:[Feature] Add support for multiple admins editing at the same time
    props.firebase.product(props.match.params.productId)
      .once("value", (snapshot) => {
        
        if(!snapshot.exists()){
          props.history.push('/404');
        }
        else {
          // Get urls for each image

          storageRef.ref().child(snapshot.val().previewImage).getDownloadURL().then((url) => {
            setPreviewImage(url)
          })

          storageRef.ref().child(snapshot.val().subImageOne).getDownloadURL().then((url) => {
            setSubImageOne(url)
          })
          storageRef.ref().child(snapshot.val().subImageTwo).getDownloadURL().then((url) => {
            setSubImageTwo(url)
          })

          storageRef.ref().child(snapshot.val().previewImage).getDownloadURL().then((url) => {
            setPreviewImage(url)
          }).catch(err => setPreviewImage(NullImage1))

          storageRef.ref().child(snapshot.val().subImageOne).getDownloadURL().then((url) => {
            setSubImageOne(url)
          }).catch(err => setSubImageOne(NullImage1))

          storageRef.ref().child(snapshot.val().subImageTwo).getDownloadURL().then((url) => {
            setSubImageTwo(url)
          }).catch(err => setSubImageTwo(NullImage1))

          console.log(snapshot.val());

          setProduct(snapshot.val());

        }

    });

  }, [props.match.params.productId]);

  if(!product){
    return(null);
  }

  return(
    <React.Fragment>
      <form onSubmit>
        <Grid container spacing={0} >
   
          <Grid item xs={6} spacing={0}>
            <img src={previewImage} className={classes.previewImage} filesLimit={1}/>
            <Grid container spacing={0}>       
                <Grid item xs={6}>
                <img src={previewImage} className={classes.secondaryImage}/>
                </Grid>
                <Grid item xs={6}>
                <img src={previewImage}className={classes.secondaryImage}/>
                </Grid>          
            </Grid>
          </Grid>

          <Grid item xs={4} >
            <div className={classes.contentPaper}>
              <Typography className={classes.directorySubtitle}>{product.category} > {product.subCategory}</Typography>
              <Typography variant="h4">{product.name}</Typography>
              <Typography variant="h6">{product.model}</Typography>
              <Typography className={classes.description}> {product.description}</Typography>

              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="h5" >{product.price} грн/ніч</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Button className={classes.cartButton} onClick={(e) => {addItemToCart(product)}} component={Link} to={'/checkout'} >Забронювати</Button>
                </Grid>
              </Grid>

              <AuthUserContext.Consumer>
                {authUser =>(
                !!authUser && authUser.isAdmin && 
                  <React.Fragment>
                  <Grid item xs={6}>
                    <Link  className={classes.link} to={`/products/edit/${props.match.params.productId}`}>
                      <Button className={classes.editButton}>Ред.</Button>
                    </Link>                
                  </Grid>
                  </React.Fragment>

                
              )}
              </AuthUserContext.Consumer>


              
              
            </div>
          </Grid>
          <Grid item xs = {2}>

          </Grid>

        
        </Grid>
        

          

      </form>
    </React.Fragment>
  );
}

export default compose(withFirebase, withAuthentication)(ProductDetails);