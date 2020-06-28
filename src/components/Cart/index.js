import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import NullImage from '../Product/No-Image-Available.jpg';
import NullImage1 from '../Product/ni.jpeg';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { Grid, Typography, CardMedia, Card, CardContent, CardActions, Button } from '@material-ui/core'

const useStyles = makeStyles({
  link:{
    textDecoration:"none"
  },
  grid:{
    margin:0,
    padding:0,
    marginLeft:0,
  },
  paper: {
    width: 400,
  },
  fullList: {
    width: 'auto',
  },
  cartButton:{
    height:47,
    width:'100%',
    color: '#FFFFFF',
    float:'center',
    backgroundColor: '#00B4F4',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  },
  
});


const CartDrawer = (props) => {
  const classes = useStyles();
  const storageRef = props.firebase.storage;

  const [total, setTotal] = React.useState(0);
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    if(props.open && !!localStorage.getItem('cart')){

      let obj = JSON.parse(localStorage.getItem('cart'));
      setTotal(0);
      setProducts([]);

      if(!!obj) {
        obj.forEach( e => {
          if(!!e.key)
            props.firebase.products().child(e.key).once('value', (snapshot) => {
              if(snapshot.exists()) {     
                      
                  // Try to get url from the storage
                  storageRef.ref().child(snapshot.val().previewImage).getDownloadURL().then( (url) => { 

                    let element = {...snapshot.val(), imageRef:url, key:snapshot.key}
                    
                    console.log(element.imageRef);
                    if(element.isPublic) {
                      setTotal(t => (+t + +element.price));
                      setProducts(a => [...a, element])
                    }                
                    // if it fails set the url to the default image
                  }).catch(err => {

                    let element = {...snapshot.val(), imageRef:NullImage1, key:snapshot.key}
                    if(element.isPublic) {
                      setTotal(t => t + element.price);
                      setProducts(a => [...a, element])
                    }
                  })
              }
            });
          })
      }
    }
  }, [props.open])

  return(
    <React.Fragment>
      <Drawer anchor="right" open={props.open} onClose={() => console.log("cart closed")}>
        <Paper className={classes.paper}>
          <List>
          {products.map((product, i) => (
            <ListItem className={classes.grid}>
              <Grid  container spacing={0}>
                <Grid item xs ={3}>
                  <img src={product.imageRef} width={'100%'} height={'100%'}/>
                </Grid>
                <Grid item xs={9}>
                  <Typography > {product.name} </Typography>
                  <Typography  > {product.model} </Typography>
                  <Typography > {product.price} грн </Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
          </List>
            <ListItem>
                <Typography variant="h6">Всього: {total} грн</Typography>
            </ListItem> 

          <Link to="/checkout" className={classes.link}> 
          <Button className={classes.cartButton}>Оплатити</Button>
          </Link>
        </Paper>

      </Drawer>
    </React.Fragment>
  );
}


const CartItem = (props) =>{

}

export default compose(withFirebase)(CartDrawer);
