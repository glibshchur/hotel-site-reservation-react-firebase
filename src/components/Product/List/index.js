
import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose'
import { withFirebase } from '../../Firebase';

import { withAuthentication, withAuthorization, AuthUserContext } from '../../Session';

import {Grid, Typography} from '@material-ui/core'
import ProductListItem from './ProductListItem'
import NullImage from '../No-Image-Available.jpg';
import NullImage1 from '../ni.jpeg';
import NewItem from './NewItem'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width:"100%",
    backgroundColor:"#EBEBEB"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  header:{
    width:"100%",
    height:50,
    backgroundColor:"#FAFAFA"
  },
  toolBar:{
    minHeight:36,
    margin:0,
    spacing:0,
    padding:0,
  },
  appBar:{
    width:`calc(100% - 225px)`,
    height:36,
    marginLeft:225,
    marginTop:0,
    backgroundColor:'#BBBBBB'
  },
  title: {
    flexGrow: 1,

  },
  tempDrawerPaper:{
    width:240,
    marginLeft:240,
    marginTop:65
  },
  drawer:{
    width:240,
    flexShrink:0,
  },
  drawerPaper:{
    marginTop:120,
    width:240
  },
  content: {
    marginLeft:225,
    flexGrow: 1,
    backgroundColor:"#EBEBEB",
  },
  modal: {
    marginLeft: 150,
    disableBackdropClick: true,
    hideBackdrop:true,
    disableEscapeKeyDown:false
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },

  toolbarIcon:{
    color: '#FFFFFF'
  },
  title:{
    marginLeft:15,
    marginTop:15,
    fontSize:18,
  },

  toolbarButton:{
    height:"100%",
    minWidth:45,
    width:50,
    margin:0,
    color: '#FFFFFF',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  },
  cartButton:{
    height:"100%",
    width:100,
    margin:0,
    color: '#FFFFFF',
    backgroundColor: '#00B4F4',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  },
  userProfilePopper:{
    backgroundColor: '#BBBBBB',
    borderRadius:0,
    margin:0,
    spacing:0,
    padding:0,
  },
  userProfilePopperButton:{
    height: 40,
    width: 150,
    align: 'left',
    color: '#FFFFFF',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  },
  userProfileMenuList:{
    margin:0,
    padding:0,
    spacing:0,
  }



}));

//TODO:[Maintainability] Split up the component
//TODO:[Optimization] Implement local store caching
const ListProducts = props => {

  const classes = useStyles();

  const [products, setProducts] = React.useState([]);

  // Private products are products with isPublic = false
  // Private products are visible only to Admin users
  const [privateProducts, setPrivateProducts] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  //Create db ref from the products matching the props categoryId
  const productRef = 
    props.firebase.products()
    .orderByChild("categoryId")
    .equalTo(`${props.match.params.category}/${props.match.params.subCategory}`);


  const storageRef = props.firebase.storage;

  const createDefaultProduct = () => {
    if(props.match.params.category && props.match.params.subCategory){
      props.firebase.createProductWithCategory(props.match.params.category, props.match.params.subCategory)
    }
  }

  useEffect(() => {

    const cr = productRef.on("child_removed", (snapshot) => {
      setProducts(e => e.filter(x => x.key !== snapshot.key));     
    })

    const cc = productRef.on("child_changed", (snapshot) => {
      const id = products.findIndex(x => x.key == snapshot.key);

      console.log(id);
      console.log(products[id]);

      if(id > -1){
        storageRef.ref().child(snapshot.val().previewImage).getDownloadURL().then( (url) => {          
          let element = {...snapshot.val(), imageRef:url, key:snapshot.key}
          console.log(element);
          let carr = products; // Copy array - Probably a better way to do it
          carr[id] = element;
          setProducts(a => carr);  
        }).catch(err => console.log(err))
      }

    })

    return () => {
      productRef.off("child_removed", cr);
      productRef.off("child_changed", cc);
    }

  }, [products])

  useEffect( () => {

    // reset products state
    setProducts([])
    setPrivateProducts([]);

    const categoryRef = 
      props.firebase.db
        .ref(`categories/${props.match.params.category}/subCategories/${props.match.params.subCategory}`)
        .once('value', snapshot => {
          // if(!snapshot.exists())
          //   props.history.push('/404')
        })


    const ca = productRef.on("child_added", (snapshot, prevChildKey) => {

      // Try to get url from the storage
      storageRef.ref().child(snapshot.val().previewImage).getDownloadURL().then( (url) => { 

        let element = {...snapshot.val(), imageRef:url, key:snapshot.key}


          setProducts(a => [...a, element])  


        // if it fails set the url to the default image
        // 
      }).catch(err => {

        let element = {...snapshot.val(), imageRef:NullImage1, key:snapshot.key}
        //let element = {...snapshot.val(), imageRef:NullImage, key:snapshot.key}


          setProducts(a => [...a, element])  


      })
     
    })

    return () => {
      productRef.off("child_added", ca);
    }

  }, [props.match.params.category, props.match.params.subCategory]);

  const deleteProduct = (uid) => {
    props.firebase.deleteProduct(uid);
  }

  // Store the cart data in browser storage
  // There's no reason for it to be stored in the db for now
  const addItemToCart = (product) => {
    let cart = localStorage.getItem('cart');
    let cartObj = !!cart && !!JSON.parse(cart) ? JSON.parse(cart) : [];


    let productId = cartObj.findIndex(x => x.key == product.key);

    if(productId == -1)
      cartObj.push(product);

    localStorage.setItem('cart',  JSON.stringify(cartObj))

  }

  if(loading) return <div>Loading</div>

  return(  
        <div>
          <div className={classes.header}>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="h6" className={classes.title}>
                  {props.match.params.category} > {props.match.params.subCategory}
                </Typography>
              </Grid>
              <Grid item xs={4}>
              </Grid>
              <Grid item xs={4}>
              </Grid>
            </Grid>
          </div>
          <Grid container>
            <AuthUserContext.Consumer>
            {authUser => products.map( (p, i) => <ProductListItem product={p} authUser={authUser} firebase={props.firebase}/>)}
            </AuthUserContext.Consumer>
            {/* <AuthUserContext.Consumer>
            {authUser => !!authUser && authUser.isAdmin && <NewItem firebase={props.firebase} category={props.match.params.category} subCategory={props.match.params.subCategory}/>}
            </AuthUserContext.Consumer>         */}
          </Grid>  
        </div>
      );
}


export default compose(withFirebase, withAuthentication)(ListProducts);