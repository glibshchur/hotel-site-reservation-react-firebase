# This project is modification of an e-commerce project
Original can be found here https://github.com/f3styr/e-commerce

# React Firebase Hotel Reservation
Dynamic single page hotel reservation application using React, firebase and material-ui.

# Demo of original project
https://e-commerce-1febb.web.app/  
Admin account email: `admin@admin.admin` password: `admin123`

# Demo of this project
https://bestforrest-bc994.web.app/

# Features

## Authentication
Uses firebase authentication in combination of firebase realtime database.   
Session based and have support for administrator accounts. 


## Products

### Creating/editing products
* Administrators can create new products. 
* New category/subcategory is created if it doesn't already exist
* Products have isPublic flag, non admin/authorised users can only see isPublic==true products
* Products have previewImage and two secondary images. Any non assigned image is shown as /`components/Product/No-Image-Available.jpg`
* Assigned images are uploaded to the firebase storage with random guid
 ### Deleting products
* Deleting a product also deletes any image associated with it
### Archiving a product
* Product gets archived by clicking the Archive button, or by deleting a category
* Archived products are visible only to Admins
* Archived products can be restored or deleted

## Categories
* Administrators can create new categories
* Categories should have unique names
* `Category.name/Subcategory.name` should be an unique path
* New categories are created in the side nav drawer or by creating a new product
* Categories have visible flag, non admin users can only see categories with visible==true flag
* Deleting a category sends all the category's products in the Archive


## User profile page
* Users can add contact info to their profile

## Shopping cart
* Stored in browser storage
* Users dont have to be logged in to add items to their shopping cart
* Only products that has flag `isPublic==true` are displayed in the cart
  
## Check out
* Check out form gets auto-filled with user contact info
  
## Admin dashboard
* Shows active orders
  
## Security
* Routes are secured with React router
* Database is secured with firebase database rules
* Server side validation with firebase database rules
* Client side validation
  

# How to Install
* Clone/Download the repository
* run `npm install`
* Log in to your firebase account and create new project
* Enable realtime database
* Enable storage
* Enable authentication with email and password
* https://firebase.google.com/docs/web/setup
* run `firebase deploy` to deploy the whole project to firebase hosting
  

# How to create an admin account
* Register from the project website
* Go to your firebase project console
* Go to database -> realtime database
* expand users directory and copy the user uid you want to make admin
* click on add child(+ button) on the root directory
* enter name : `admins/(user uid)/isAdmin` value:`true`
* the user uids in `admins` are administrator accounts

# How to deploy to firebase
* https://firebase.google.com/docs/web/setup
* run `npm run build -p` 
* run `firebase deploy`


# Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.



## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
