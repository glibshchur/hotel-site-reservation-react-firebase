import React, { useEffect, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { withFirebase } from '../Firebase'
import { withAuthorization } from '../Session'
import { compose } from 'recompose'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  drawer:{
    width:240,
    flexShrink:0,

  },
  drawerPaper:{
    marginTop:0,
    width:225,
    backgroundColor:"#DDDDDC",
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
    color:"#00c3d9",
    marginLeft:30
  },
  adminNavButton:{
    color:"#ffffff",
    marginLeft:30
  }
}));

const condition = authUser => authUser && authUser.isAdmin;


const NewCategoryButton = (props) => {

  const classes = useStyles();

  const [active, setActive] = useState(false);
  const [category, setCategory] = useState('');

  const onSubmit = (event) => {

    console.log('asd');

    if(props.category){
      props.firebase.createCategory(props.category, category).catch(e => console.log(e));
    }
    else{
      props.firebase.createCategory(category, null).catch(e => console.log(e));
    }
    
    event.preventDefault();

    setActive(false);
    

  }

  // Currently using a form to submit the new catgeory
  // Can also be done with keyDown callback which might be better
  if(active)  {
    return(
      <React.Fragment>
        <form onSubmit = {onSubmit}>
          <TextField
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            type="text"
            autoFocus          
            margin="normal"
            id="category"
            label="Category Name"
            fullWidth
          />
        </form>
      </React.Fragment>
    )
  }

  return(  
    <React.Fragment>
      <ListItem button onClick={(e) => setActive(true)}>
        <Typography variant="h6" className={classes.adminNavButton} >+</Typography>
      </ListItem>
    </React.Fragment>
  )

}

export default compose(withFirebase)(NewCategoryButton)