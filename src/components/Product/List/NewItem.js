import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, CardMedia, Card, CardContent, CardActions, Button } from '@material-ui/core'
import { typography } from '@material-ui/system';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import NullImage from '../Create-New-Product.jpg';

const useStyles = makeStyles(theme => ({
  gridItemAdmin:{
    height:580,
    width:"100%",
    borderRadius:0, 

    '&:hover':{
      backgroundColor: '#FCFDFC'
    } 
  },
  gridItem:{
    height:400,
    width:"100%",
    borderRadius:0, 

    '&:hover':{
      backgroundColor: '#FCFDFC'
    }
  },
  card: {
    maxHeight:100,
    borderRadius:0,
    textDecoration: "none",
  },
  cardContent:{
    height:100,
    backgroundColor:"#F1F2F0",


  },
  media: {
    height: 400,
    borderRadius:0,

  },
  link:{
    textDecoration: "none",
    color:"#000000"
  }
}));




const NewItem = props => {
  const classes = useStyles();

  const createDefaultProduct = () => {
    if(props.category && props.subCategory){
      props.firebase.createProductWithCategory(props.category, props.subCategory)
    }
  }

  return(
    
      <Grid className={classes.gridItem} item xs={3}>
          <Card elevation={0} onClick={()=>{createDefaultProduct()}}>
            <CardMedia 
            className={classes.media}
            image={NullImage}
            title={"test"}       
            />
          </Card>
      </Grid>
    
  )


}

export default NewItem;