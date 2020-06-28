
import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navigation from '../Navigation'
import SignUp from '../User/SignUp'
import Contact from '../Contact';
import Footer from '../Footer';
import AccountDetails from '../User/Details'
import Archive from '../Archive';
import EditProduct from '../Product/Edit'
import SignInDialog from '../User/SignIn'
import CreateProduct from '../Product/Create'
import CheckOutView from '../CheckOut'
import TopBar from '../Navigation/TopBar';
import ListProducts from '../Product/List';
import ProductDetails from '../Product/Details';
import PageNotFound from '../Error/404';
import Dashboard from '../Admin'
import Home from '../Home'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width:"100%",
    backgroundColor:"#EBEBEB"
  },
  noOffsetContent:{
    marginLeft:300,
    flexGrow: 1,
    backgroundColor:"#EBEBEB",
    padding: 0,
  },
}));


const App = (props) => {
  const classes = useStyles();
  return(
    <Router>
      <div className={classes.root}>
          <CssBaseline />
          <TopBar/>   
          <Navigation />
          <main> 
            <div className={classes.noOffsetContent}>
            <Switch>
              <Route path="/store/:category/:subCategory" component={ListProducts}/>
              <Route path="/archive" component={Archive}/>
              <Route path ="/products/details/:productId" component={ProductDetails}/>
              <Route exact path="/" component={Home} key="asd"/>
              <Route path="/create" component={CreateProduct}/>   
              <Route path="/products/edit/:productId" component={EditProduct}/>
              <Route path="/checkout" component={CheckOutView}/>
              <Route path="/login" component={SignInDialog}/>
              <Route path="/account" component={AccountDetails}/>
              <Route path="/register" component={SignUp}/>
              <Route path="/contact" component={Contact}/>
              <Route path="/dashboard" component={Dashboard}/>
              <Route component={PageNotFound}/>
              </Switch>
            </div>  
          
          </main>
        </div>
        <Footer/>
    </Router>

  );
}

export default App;
