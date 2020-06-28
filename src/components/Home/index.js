import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Background from './background.jpeg';

const useStyles = makeStyles(theme => ({
  bg:{
    width:'100%',
    height:900,
    backgroundImage:`url(${Background})`,
    backgroundSize:'2480px 1032px'
  },
}));

const Home = props => {
  const classes = useStyles();

  return(
    <div className={classes.bg}>
    </div>
  )
}

export default Home;