import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose'
import { withAuthorization, withAuthentication, AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'

import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import SubCategoryDrawer from './SubCategoryDrawer'
import NewCategoryButton from './NewCategoryButton'
import Logo from './logo.svg'
import Typography from '@material-ui/core/Typography';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Button from '@material-ui/core/Button'
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';


const useStyles = makeStyles(theme => ({

  drawer:{
    width:300,
    flexShrink:0,

  },
  drawerPaper:{
    marginTop:0,
    width:300,
    backgroundColor:"#00c3d9",
    borderRight:0,
  },
  logo:{
    marginTop:20,
    marginRight:40,
    marginLeft:30,
  },
  navList:{
    marginTop:110,

  },
  link:{
    textDecoration:"none",
  },
  navButton:{
    color:"#ffffff",
    marginLeft:30
  },
  adminNavButton:{
    color:"#ffffff",
    marginLeft:30
  },
  icon:{
    minWidth:15,
    miHeight:15,
    width:15,
    height:15,
  },
  buttons:{
    height:25,
    minWidth:25,
    width:25,
    margin:0,
    marginLeft:5,
    color: "#ffffff",
    borderRadius:0,
    '&:hover':{
      backgroundColor: 'rgba(255,255,255,0)',
      color: '#ffffff'
    }
  },
  link:{
    textDecoration:"none"
  },
  tempDrawerPaper:{
    width:300,
    marginLeft:300,
    marginTop:38,
    backgroundColor:"rgba(221,221,220, 0.92)"
  },
}));

const SideSubCategoryDrawer = (props) => {
  const classes = useStyles();

  const categoryRef = props.firebase.categoryRef();

  const [categories, setCategories] = React.useState([])
  const [open, setOpen] = React.useState(true);


  const refreshCategories = () => {

    setCategories([]);

    let subCategoryRef = categoryRef.child(props.category).child("subCategories");

    subCategoryRef.once("value", (ss, prevChildKey) => {
      ss.forEach((snapshot) => setCategories(x => [...x, {name:snapshot.key, key:snapshot.key, visible:snapshot.val().visible}]))
            
    })
  }

  useEffect( () => {

    if(!props.category) return;
    
    setCategories([]);

    let subCategoryRef = categoryRef.child(props.category).child("subCategories");

    const ca = subCategoryRef.on("child_added", (snapshot, prevChildKey) => {
      setCategories(x => [...x, {name:snapshot.key, key:snapshot.key, visible:snapshot.val().visible}])      
    })

    const cr = subCategoryRef.on("child_removed", (snapshot) => {
      refreshCategories();
    })

    //TODO: [Functionality] Update child state
    const cc = subCategoryRef.on("child_changed", (snapshot) => {
      refreshCategories();
    })

    return () => {
      subCategoryRef.off("child_added", ca);
      subCategoryRef.off("child_removed", cr);
      subCategoryRef.off("child_changed", cc);
    }

  }, [props.category]);

  return(
    <Drawer open={props.open} variant="persistent"
    classes={{
            paper: classes.tempDrawerPaper,
            modal: classes.modal
          }}>
            <List className={classes.navList} dense="true">
              { categories.map((category, index) => (
                <AuthUserContext.Consumer>
                  {authUser => {
                    if(((!!authUser && !authUser.isAdmin) || (!!!authUser)) && category.visible)
                      return(

                        <Link className={classes.link} to={`/store/${props.category}/${category.name}/`}>
                          <ListItem button key={category.key}>
                            
                            
                            <Typography variant="h6" className={classes.navButton} > {category.name} </Typography>  
                            
                          </ListItem>
                        </Link>

                      ) 
                    else if(!!authUser && authUser.isAdmin)
                      return(
                        
                        <Link  className={classes.link} to={`/store/${props.category}/${category.name}/`}>
                          <ListItem button key={category.key}>
                            
                            <Typography variant="h6" className={classes.navButton} > {category.name} </Typography>
                            

                              <ListItemSecondaryAction>
                                {category.visible && <Button className={classes.buttons} onClick={(e) => {props.firebase.setCategoryVisible(props.category, category.name, false)}}>
                                <VisibilityOutlinedIcon />
                              
                            </Button>}

                            {!category.visible && <Button className={classes.buttons} onClick={(e) => {props.firebase.setCategoryVisible(props.category, category.name, true)}} >
                            <VisibilityOffOutlinedIcon />
                            </Button>}

                            <Button className={classes.buttons} onClick={(e) => {props.firebase.deleteCategory(props.category, category.name)}} >
                              <HighlightOffIcon />
                            </Button>

                            </ListItemSecondaryAction> 
                          </ListItem>
                          </Link>                                                                       
                      )
                  }}
                </AuthUserContext.Consumer>
              ))}
              <AuthUserContext.Consumer>   
                {authUser => !!authUser && authUser.isAdmin && <NewCategoryButton category={props.category}/> }                
              </AuthUserContext.Consumer> 
            </List>
    </Drawer>
  )

  return (
  <div>
    <Drawer open={props.open} variant="persistent"
    classes={{
            paper: classes.tempDrawerPaper,
            modal: classes.modal
          }}>

      <List class={classes.navList}>
        {categories.map((category, index) => (                          
          <Link key={category.name} to={`/store/${props.category}/${category.name}/`}> 
            <ListItem button key={category.name}>
              <ListItemText primary={category.name} />
            </ListItem>
          </Link>
          
        ))}
        <NewCategoryButton category={props.category}/>
      </List>


    </Drawer>
  </div>)
}


export default compose(withAuthentication)(SideSubCategoryDrawer);