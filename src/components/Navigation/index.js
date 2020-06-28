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
}));


const SideNavigationDrawer = (props) => {

  const classes = useStyles();
  const categoryRef = props.firebase.categoryRef();

  const el = useRef(null); // ref to the sub nav

  const [categories, setCategories] = React.useState([])
  const [subCategoriesOpen, setSubCategoriesOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState({});

  const handleClick = (e) =>{
    // close the subnav if we click away
    if(!el.current.contains(e.target)){
      setSubCategoriesOpen(false);
    }
  }

  const refreshCategories = () => {
    setCategories([]);

    categoryRef.once("value", (snapshot, prevChildKey) => {
       snapshot.forEach(ss => setCategories(x => [...x, {name:ss.key, key:ss.key, visible:ss.val().visible}]) )
              
    })
  }

  useEffect( () => {

    document.addEventListener('mousedown', handleClick, false);

    const ca = categoryRef.on("child_added", (snapshot, prevChildKey) => {
      setCategories(x => [...x, {name:snapshot.key, key:snapshot.key, visible:snapshot.val().visible}])      
    })

    const cr = categoryRef.on("child_removed", (snapshot) => {
      refreshCategories();

    })

    //TODO: [Functionality] Update child state
    const cc = categoryRef.on("child_changed", (snapshot) => {
      refreshCategories();
    })

    return () => {
      categoryRef.off("child_added", ca);
      categoryRef.off("child_removed", cr);
      categoryRef.off("child_changed", cc);
      document.removeEventListener('mousedown', handleClick, false);
    }

  }, []);

  const openSubCategoryDrawer = (cat) => {
    setSubCategoriesOpen(true);
    setSelectedCategory(cat);
  }

  return(
    <div ref={el}>    
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
            boxShadow={5}
          >
            <Link  to="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h4" className={classes.navButton} > Best For Rest </Typography> 
              {/* <img src={Logo} className={classes.logo} height="100"/> */}
            </Link>
            

            <List className={classes.navList} dense="true">
              { categories.map((category, index) => (
                <AuthUserContext.Consumer key={category.key}>
                  {authUser => {
                    if(((!!authUser && !authUser.isAdmin) || (!!!authUser)) && category.visible)
                      return(
                        <ListItem button key={category.key} onClick={() => {openSubCategoryDrawer(category)}}>
                          <Typography variant="h6" className={classes.navButton} > {category.name} </Typography>  
                        </ListItem>
                      ) 
                    else if(!!authUser && authUser.isAdmin)
                      return(
                        
                          <ListItem button key={category.key} onClick={() => {openSubCategoryDrawer(category)}}>
                            <Typography variant="h6" className={classes.navButton} > {category.name} </Typography> 
                              <ListItemSecondaryAction>
                                {category.visible && <Button className={classes.buttons} onClick={(e) => {props.firebase.setCategoryVisible(category.name, null, false)}}>
                                <VisibilityOutlinedIcon />
                            </Button>}

                            {!category.visible && <Button className={classes.buttons} onClick={(e) => {props.firebase.setCategoryVisible(category.name, null, true)}} >
                            <VisibilityOffOutlinedIcon />
                              
                            </Button>}

                            <Button className={classes.buttons} onClick={(e) => {props.firebase.deleteCategory(category.name, null)}} >
                              <HighlightOffIcon />
                            </Button>

                            </ListItemSecondaryAction> 
                          </ListItem>                                                                      
                      )
                  }}
                </AuthUserContext.Consumer>
              ))}
              <AuthUserContext.Consumer>   
                {authUser => !!authUser && authUser.isAdmin && <NewCategoryButton/> }                
              </AuthUserContext.Consumer> 
            </List>
            <Divider />
              <List >
                <AuthUserContext.Consumer>
                {authUser => {           
                  if(authUser && authUser.isAdmin)
                    return(  
                      <React.Fragment>   
                                
                        <Link to={"/archive"} className={classes.link}>
                          <ListItem button key="Archive">             
                          <Typography variant="h6" className={classes.adminNavButton} >Архів Номерів</Typography>
                          </ListItem>
                        </Link>
                        <Link to={"/dashboard"} className={classes.link}>
                          <ListItem button key="Dashboard">             
                          <Typography variant="h6" className={classes.adminNavButton} >Активні бронювання</Typography>
                          </ListItem>
                        </Link>
                        <Link to={"/create"} className={classes.link} >
                          <ListItem button key="New Product">             
                          <Typography variant="h6" className={classes.adminNavButton} >Створити Новий Номер</Typography>
                          </ListItem>
                        </Link>
                    </React.Fragment>  
                    )
                  else
                    return(
                      <React.Fragment>                               
                      <Link to={"/contact"} className={classes.link}>
                        <ListItem button key="Archive">             
                        <Typography variant="h6" className={classes.adminNavButton} >Контакти</Typography>
                        </ListItem>
                      </Link>                     
                      <Link to={"/account"} className={classes.link}>
                        <ListItem button key="Бронювання">             
                        <Typography variant="h6" className={classes.adminNavButton} >Обліковий запис</Typography>
                        </ListItem>
                      </Link>
                      <Link to={"/checkout"} className={classes.link} >
                        <ListItem button key="New Product">             
                        <Typography variant="h6" className={classes.adminNavButton} >Бронювання</Typography>
                        </ListItem>
                      </Link>
                  </React.Fragment>  
                    )
                }}
                </AuthUserContext.Consumer>
              </List>
          </Drawer>  
          <SubCategoryDrawer open={subCategoriesOpen} category={selectedCategory.name}/>
      </div>
  );
}

export default compose(withAuthentication)(SideNavigationDrawer);