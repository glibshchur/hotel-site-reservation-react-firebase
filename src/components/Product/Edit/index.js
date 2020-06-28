import React, { Component, useState, useEffect, isValidElement } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {DropzoneArea} from 'material-ui-dropzone'

import Checkbox from '@material-ui/core/Checkbox'
import { withFirebase } from '../../Firebase';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid'
import { withAuthorization, withAuthentication } from '../../Session';
import { makeStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { debug } from 'util';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import SingleLineError from '../../Error'
import { Typography } from '@material-ui/core';

//<Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>

const useStyles = makeStyles(theme => ({
  upload:{
    border : "1px solid black"
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
  signInButton:{
    height:47,
    width:80,
    marginTop:20,
    marginBottom:150,
    color: '#FFFFFF',
    backgroundColor: '#00B4F4',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  },
  deleteButton:{
    height:47,
    width:80,
    marginLeft:100,
    marginTop:20,
    marginBottom:150,
    color: '#FFFFFF',
    float: 'right',
    backgroundColor: '#B40000',
    borderRadius:0,
    '&:hover':{
      backgroundColor: '#D6D6D6'
    }
  }
}));

const EditProduct = (props) => {

  const classes = useStyles();
  const categoryRef = props.firebase.categoryRef();

  const [category, setCategory] = useState('');                   // not '', len < 50
  const [subCategory, setSubCategory] = useState('');             // not '', len < 50
  const [name, setName] = useState('');                           // not '', len < 50
  //const [tags, setTags] = useState('');                           // len < 500
  const [description, setDescription] = useState('');             // not '', len < 1000
  const [details, setDetails] = useState('');                     // no validation, len < 1000
  const [price, setPrice] = useState(0);                          // > 0
  const [previewImage, setPreviewImage] = useState(null);         
  const [subImageOne, setSubImageOne] = useState(null);           
  const [subImageTwo, setSubImageTwo] = useState(null);           
  const [isPublic, setIsPublic] = useState('')
  //const [model, setModel] = useState('');  // len < 50
  const [categories, setCategories] = React.useState([])
  const [subCategories, setSubCategories] = React.useState([]);
  const [errors, setErrors] = React.useState([]);


  const onDelete = event =>{
    props.firebase.deleteProduct(props.match.params.productId);
  }
  const onSubmit = event => {

    setErrors([]);

    let _errors = [];

    if(category.length > 50) _errors.push('Category should be less than 50 characters');
    if(subCategory.length > 50) _errors.push('Sub category should be less than 50 characters');
    if(name.length > 50) _errors.push('Name should be less than 50 characters');
    //if(tags.length > 500) _errors.push('Tags should be less than 500 characters');
    if(category.length > 50) _errors.push('Category should be less than 50 characters');
    if(description.length > 1000) _errors.push('Description should be less than 1000 characters');
    if(details.length > 1000) _errors.push('Details should be less than 1000 characters');
    if(price < 0) _errors.push('Price should be a non negative number');
    //if(model.length > 50) _errors.push('Model should be less than 50 characters');

    setErrors(_errors);

    if(_errors.length > 0) return;
    
    props.firebase.editProduct(props.match.params.productId, {
      category,
      subCategory,
      name,
      description,
      details,
      price,
      previewImage,
      subImageOne,
      subImageTwo,
      isPublic,
    })
    .then(x => props.history.push(`/store/${category}/${subCategory}`))
    .catch(err => setErrors([err.message]))//setErrors(["Something went wrong when trying to create new product"])) 

    //event.preventDefault();
  }


  // Update autocomplete when category changes
  // This event is fired when user selects autocomplete option
  const onCategorySelect = (event, val) => {
    setSubCategories([]);
    setCategory(val);
    categories.forEach(x => {
      if(x.name === val && !!x.subCategories){
        setSubCategories( Object.keys(x.subCategories) )       
      }
    })
  }
  //This event fires when user writes in the autocomplete textbox
  const onCategoryChange = (event) => {
    setSubCategories([]);
    
    let val = event.target.value;
    setCategory(val);
    categories.forEach(x => {
      if(x.name === val && !!x.subCategories){
        setSubCategories( Object.keys(x.subCategories) )
      }
    })
  }

  useEffect(() => {
    props.firebase.product(props.match.params.productId)
      .once("value", (snapshot) => {
        
        if(!snapshot.exists()){
          props.history.push('/404');
        }
        else {
          setCategory(snapshot.val().category);
          setSubCategory(snapshot.val().subCategory);
          setName(snapshot.val().name);
          //setTags(snapshot.val().tags);
          setDescription(snapshot.val().description);
          setDetails(snapshot.val().details);
          setPrice(snapshot.val().price);   
          setSubImageOne(snapshot.val().subImageOne == 'null.jpg' ? null : snapshot.val().subImageOne);
          setPreviewImage(snapshot.val().previewImage == 'null.jpg' ? null : snapshot.val().subImageOne);
          setSubImageTwo(snapshot.val().subImageTwo == 'null.jpg' ? null : snapshot.val().subImageOne);   
          
          setIsPublic(snapshot.val().isPublic);
         //setModel(snapshot.val().model);
          setErrors(snapshot.val().errors);
        }
    })     
  }, [props.match.params.productId]);

  useEffect( () => {
    const ca = categoryRef.on("child_added", (snapshot, prevChildKey) => {    
      setCategories(x => [...x, {name:snapshot.key, key:snapshot.key, subCategories:snapshot.val().subCategories}])      
    })

    const cr = categoryRef.on("child_removed", (snapshot) => {
      setCategories(x => x.filter(e => e !== snapshot.key) )
    })

    return () => {
      categoryRef.off("child_added", ca);
      categoryRef.off("child_removed", cr);
    }
  }, [])




  return(
    <React.Fragment>

      <Typography className={classes.title} variant="h5"> Додати Новий Номер </Typography>

      <form onSubmit={onSubmit}>
        <Grid container spacing={5} >
   
          <Grid item xs={6} spacing={5}>
            <DropzoneArea className={classes.upload} filesLimit={1} dropzoneText="Додайте фото" onChange={(file) => setPreviewImage(file)}/>
            <Grid item xs={12}>
              <div className={classes.spacer}> </div>
            </Grid>
            <Grid container spacing={2}>
            
                <Grid item xs={6}>
                  <DropzoneArea className={classes.upload} dropzoneText="Додайте фото" onChange={(file) => setSubImageOne(file)}/>
                </Grid>
                <Grid item xs={6}>
                  <DropzoneArea className={classes.upload} dropzoneText="Додайте фото" onChange={(file) => setSubImageTwo(file)}/>
                </Grid>
              
            </Grid>

            <div className={classes.verticalSpacer}>
              {!!errors && errors.map((e, i) => <SingleLineError key={i} error={e}/>)}
            </div>

            

          </Grid>

          <Grid item xs={5}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <Autocomplete 
                  freeSolo
                  id="category"
                  options={categories.map(category => category.name)}
                  onChange={onCategorySelect}
                  value={category}
                  renderInput={params => (
                    <TextField autoFocus  
                    {...params}        
                    margin="normal"
                    name="category"
                    id="category"
                    label="Назва комплексу"
                    value={category}
                    onChange={onCategoryChange}     
                    fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
              <Autocomplete 
                  freeSolo
                  id="category"
                  options={subCategories.map(category => category)}
                  onChange={(e,v) => {setSubCategory(v)}}
                  value={subCategory}
                  renderInput={params => (
                    <TextField autoFocus  
                    {...params}        
                    margin="normal"
                    name="subCategory"
                    id="subCategory"
                    label="Назва готелю"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}     
                    fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>

          
                  
              <Grid container spacing={5}>
                <Grid item xs={6}>                      
                  <TextField autoFocus          
                    margin="normal"
                    name="name"
                    id="name"
                    label="Назва номеру"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    
                    fullWidth
                  />
                </Grid>
                {/* <Grid item xs={6}>                         
                  <TextField autoFocus          
                    margin="normal"
                    name="subName"
                    id="subName"
                    label="model (max 50 char)"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    
                    fullWidth
                  />
                </Grid> */}
              </Grid> 
            


          <TextField autoFocus          
            margin="normal"
            name="description"
            multiline
            rows={8}
            id="description"
            label="Опис..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            
            fullWidth
          />

          <TextField autoFocus          
            margin="normal"
            name="details"
            multiline
            rows={6}
            id="details"
            label="Деталі"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            
            fullWidth
          />

          {/* <TextField autoFocus          
            margin="normal"
            name="tags"
            id="tags"
            label="Tag (max 500 char)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            multiline
            fullWidth
          /> */}
          
          <TextField autoFocus          
            margin="normal"
            name="price"
            id="price"
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}         
            fullWidth
          />
          <div>
            <FormControlLabel
            value="bottom"
            control={<Checkbox color="primary" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>}
            label="Publish "
            labelPlacement="left"
            />
          </div>

          <Button type="submit" className={classes.signInButton}> Оновити </Button>
          <Button onClick={onDelete}className={classes.deleteButton}> Видалити </Button>
          </Grid>
        
        </Grid>
        

          

      </form>
    </React.Fragment>
  );
}

const condition = authUser => !!authUser && authUser.isAdmin;

export default compose(withAuthentication, withAuthorization(condition), withFirebase)(EditProduct);