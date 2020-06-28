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
  }
}));

// TODO: [Feature] Add support for categories without subCategories
const CreateProduct = (props) => {

  const classes = useStyles();
  const categoryRef = props.firebase.categoryRef();

  //category
  //subcategory
  //Name
  //Tags
  //Description
  //Details
  //price
  //mainImage
  //subImage1
  //subImage2
  //visible
  //TODO:[Feature] Variants
  

  const [category, setCategory] = useState('');                   // not '', len < 50
  const [subCategory, setSubCategory] = useState('');             // not '', len < 50
  const [name, setName] = useState('');                           // not '', len < 50
  const [tags, setTags] = useState('');                           // len < 500
  const [description, setDescription] = useState('');             // not '', len < 1000
  const [details, setDetails] = useState('');                     // no validation, len < 1000
  const [price, setPrice] = useState(0);                          // > 0
  const [previewImage, setPreviewImage] = useState(null);         
  const [subImageOne, setSubImageOne] = useState(null);           
  const [subImageTwo, setSubImageTwo] = useState(null);           
  const [isPublic, setIsPublic] = useState(false)
  const [model, setModel] = useState('');  // len < 50
  const [categories, setCategories] = React.useState([])
  const [subCategories, setSubCategories] = React.useState([]);
  const [errors, setErrors] = React.useState([]);



  const onSubmit = event => {

    setErrors([]);

    let _errors = [];

    if(category.length > 50) _errors.push('Category should be less than 50 characters');
    if(subCategory.length > 50) _errors.push('Sub category should be less than 50 characters');
    if(name.length > 50) _errors.push('Name should be less than 50 characters');
    if(tags.length > 500) _errors.push('Tags should be less than 500 characters');
    if(category.length > 50) _errors.push('Category should be less than 50 characters');
    if(description.length > 1000) _errors.push('Description should be less than 1000 characters');
    if(details.length > 1000) _errors.push('Details should be less than 1000 characters');
    if(price < 0) _errors.push('Price should be a non negative number');
    if(model.length > 50) _errors.push('Model should be less than 50 characters');

    setErrors(_errors);

    if(_errors.length > 0) return;
    
    props.firebase.createProduct({
      category,
      subCategory,
      tags,
      name,
      description,
      details,
      price,
      previewImage,
      subImageOne,
      subImageTwo,
      isPublic,
      model
    })
    .then(x => props.history.push(`/store/${category}/${subCategory}`))
    .catch(err => setErrors([err.message]))//setErrors(["Something went wrong when trying to create new product"])) 

    event.preventDefault();
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

      <Typography className={classes.title} variant="h5"> Додати новий номер </Typography>

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
                  renderInput={params => (
                    <TextField autoFocus  
                    {...params}        
                    margin="normal"
                    name="category"
                    id="category"
                    label="Комплекс"
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
                  renderInput={params => (
                    <TextField autoFocus  
                    {...params}        
                    margin="normal"
                    name="subCategory"
                    id="subCategory"
                    label="Готель"
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
                    label="Назва"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    
                    fullWidth
                  />
                </Grid>
                
              </Grid> 

          <TextField autoFocus          
            margin="normal"
            name="description"
            multiline
            rows={8}
            id="description"
            label="Опис"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />

          <TextField autoFocus          
            margin="normal"
            name="Деталі"
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
          />
           */}
          <TextField autoFocus          
            margin="normal"
            name="price"
            id="price"
            label="Ціна"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}         
            fullWidth
          />
          <div>
            <FormControlLabel
            value="bottom"
            control={<Checkbox color="primary" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>}
            label="Опублікувати "
            labelPlacement="left"
            />
          </div>

          <Button type="submit" className={classes.signInButton}> Додати </Button>
          </Grid>
        
        </Grid>
      </form>
    </React.Fragment>
  );
}

const condition = authUser => !!authUser && authUser.isAdmin;

export default compose(withAuthentication, withAuthorization(condition), withFirebase)(CreateProduct);

// import React, { Component, useState, useEffect, isValidElement } from 'react';

// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// import {DropzoneArea} from 'material-ui-dropzone'

// import Checkbox from '@material-ui/core/Checkbox'
// import { withFirebase } from '../../Firebase';
// import { compose } from 'recompose';
// import Grid from '@material-ui/core/Grid'
// import { withAuthorization, withAuthentication } from '../../Session';
// import { makeStyles } from '@material-ui/styles';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import { debug } from 'util';

// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
// import SingleLineError from '../../Error'
// import { Typography } from '@material-ui/core';
// import { render } from 'react-dom';

// const useStyles = makeStyles(theme => ({
//   upload:{
//     border : "1px solid black"
//   },
//   spacer:{
//     height:20
//   },
//   errorDiv:{
//     marginTop:55,
//   },
//   title:{
//     marginTop:50,
//     marginBottom:50,
//   },
//   signInButton:{
//     height:47,
//     width:80,
//     marginTop:20,
//     marginBottom:150,
//     color: '#FFFFFF',
//     backgroundColor: '#00B4F4',
//     borderRadius:0,
//     '&:hover':{
//       backgroundColor: '#D6D6D6'
//     }
//   }
// }));

// const CreateProduct = (props) => {

//   const classes = useStyles();
//   const categoryRef = props.firebase.categoryRef();

//   const [category, setCategory] = useState('');                   // not '', len < 50
//   const [subCategory, setSubCategory] = useState('');             // not '', len < 50
//   const [name, setName] = useState('');                           // not '', len < 50
//   const [description, setDescription] = useState('');             // not '', len < 1000
//   const [details, setDetails] = useState('');                     // no validation, len < 1000
//   const [price, setPrice] = useState(0);                          // > 0
//   const [previewImage, setPreviewImage] = useState(null);         
//   const [subImageOne, setSubImageOne] = useState(null);           
//   const [subImageTwo, setSubImageTwo] = useState(null);           
//   const [isPublic, setIsPublic] = useState(true)
//   const [categories, setCategories] = React.useState([])
//   const [subCategories, setSubCategories] = React.useState([]);
//   const [errors, setErrors] = React.useState([]);



//   const onSubmit = event => {

//     setErrors([]);

//     let _errors = [];

//     if(category.length > 50) _errors.push('Category should be less than 50 characters');
//     if(subCategory.length > 50) _errors.push('Sub category should be less than 50 characters');
//     if(name.length > 50) _errors.push('Name should be less than 50 characters');
//     if(category.length > 50) _errors.push('Category should be less than 50 characters');
//     if(description.length > 1000) _errors.push('Description should be less than 1000 characters');
//     if(details.length > 1000) _errors.push('Details should be less than 1000 characters');
//     if(price < 0) _errors.push('Price should be a non negative number');

//     setErrors(_errors);

//     if(_errors.length > 0) return;
    
//     props.firebase.createProduct({
//       category,
//       subCategory,
//       name,
//       description,
//       details,
//       price,
//       previewImage,
//       subImageOne,
//       subImageTwo,
//       isPublic,
//     })
//     .then(x => props.history.push(`/store/${category}/${subCategory}`))
//     .catch(err => setErrors([err.message]))//setErrors(["Something went wrong when trying to create new product"])) 

//     event.preventDefault();
//   }


//   // Update autocomplete when category changes
//   // This event is fired when user selects autocomplete option
//   const onCategorySelect = (event, val) => {
//     setSubCategories([]);
//     setCategory(val);
//     categories.forEach(x => {
//       if(x.name === val && !!x.subCategories){
//         setSubCategories( Object.keys(x.subCategories) )       
//       }
//     })
//   }
//   //This event fires when user writes in the autocomplete textbox
//   const onCategoryChange = (event) => {
//     setSubCategories([]);
    
//     let val = event.target.value;
//     setCategory(val);
//     categories.forEach(x => {
//       if(x.name === val && !!x.subCategories){
//         setSubCategories( Object.keys(x.subCategories) )
//       }
//     })
//   }


//   useEffect( () => {
//     const ca = categoryRef.on("child_added", (snapshot, prevChildKey) => {    
//       setCategories(x => [...x, {name:snapshot.key, key:snapshot.key, subCategories:snapshot.val().subCategories}])      
//     })

//     const cr = categoryRef.on("child_removed", (snapshot) => {
//       setCategories(x => x.filter(e => e !== snapshot.key) )
//     })

//     return () => {
//       categoryRef.off("child_added", ca);
//       categoryRef.off("child_removed", cr);
//     }
//   }, [])




//   return(
//     <React.Fragment>

//       <Typography className={classes.title} variant="h5"> Додати новий номер </Typography>

//       <form onSubmit={onSubmit}>
//         <Grid container spacing={5} >
   
//           <Grid item xs={6} spacing={5}>
//             <DropzoneArea className={classes.upload} filesLimit={1} dropzoneText="Додайте фото" onChange={(file) => setPreviewImage(file)}/>
//             <Grid item xs={12}>
//               <div className={classes.spacer}> </div>
//             </Grid>
//             <Grid container spacing={2}>
            
//                 <Grid item xs={6}>
//                   <DropzoneArea className={classes.upload} dropzoneText="Додайте фото" onChange={(file) => setSubImageOne(file)}/>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <DropzoneArea className={classes.upload} dropzoneText="Додайте фото" onChange={(file) => setSubImageTwo(file)}/>
//                 </Grid>
              
//             </Grid>

//             <div className={classes.verticalSpacer}>
//               {!!errors && errors.map((e, i) => <SingleLineError key={i} error={e}/>)}
//             </div>

            

//           </Grid>

//           <Grid item xs={5}>
//             <Grid container spacing={5}>
//               <Grid item xs={6}>
//                 <Autocomplete 
//                   freeSolo
//                   id="category"
//                   options={categories.map(category => category.name)}
//                   onChange={onCategorySelect}
//                   renderInput={params => (
//                     <TextField autoFocus  
//                     {...params}        
//                     margin="normal"
//                     name="category"
//                     id="category"
//                     label="Комплекс"
//                     value={category}
//                     onChange={onCategoryChange}     
//                     fullWidth
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//               <Autocomplete 
//                   freeSolo
//                   id="category"
//                   options={subCategories.map(category => category)}
//                   onChange={(e,v) => {setSubCategory(v)}}
//                   renderInput={params => (
//                     <TextField autoFocus  
//                     {...params}        
//                     margin="normal"
//                     name="subCategory"
//                     id="subCategory"
//                     label="Готель"
//                     value={subCategory}
//                     onChange={(e) => setSubCategory(e.target.value)}     
//                     fullWidth
//                     />
//                   )}
//                 />
//               </Grid>
//             </Grid>

          
                  
//               <Grid container spacing={5}>
//                 <Grid item xs={6}>                      
//                   <TextField autoFocus          
//                     margin="normal"
//                     name="name"
//                     id="name"
//                     label="Назва"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
                    
//                     fullWidth
//                   />
//                 </Grid>
                
//               </Grid> 

//           <TextField autoFocus          
//             margin="normal"
//             name="description"
//             multiline
//             rows={8}
//             id="description"
//             label="Опис"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             fullWidth
//           />

//           <TextField autoFocus          
//             margin="normal"
//             name="Деталі"
//             multiline
//             rows={6}
//             id="details"
//             label="Деталі"
//             value={details}
//             onChange={(e) => setDetails(e.target.value)}
            
//             fullWidth
//           />

//           {/* <TextField autoFocus          
//             margin="normal"
//             name="tags"
//             id="tags"
//             label="Tag (max 500 char)"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             multiline
//             fullWidth
//           />
//            */}
//           <TextField autoFocus          
//             margin="normal"
//             name="price"
//             id="price"
//             label="Ціна"
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}         
//             fullWidth
//           />
//           <div>
//             <FormControlLabel
//             value="bottom"
//             control={<Checkbox color="primary" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>}
//             label="Опублікувати "
//             labelPlacement="left"
//             />
//           </div>

//           <Button type="submit" className={classes.signInButton}> Додати </Button>
//           </Grid>
        
//         </Grid>
//       </form>
//     </React.Fragment>
//   );
// }

// const condition = authUser => !!authUser && authUser.isAdmin;

// export default compose(withAuthentication, withAuthorization(condition), withFirebase)(CreateProduct);