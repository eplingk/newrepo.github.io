/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/index.js")

// require session
const session = require("express-session")
const pool = require('./database/')

// Body Parser
const bodyParser = require("body-parser")

// cookies
const cookieParser = require("cookie-parser")



/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({ extended: true }))


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// cookies
app.use(cookieParser())

app.use(utilities.checkJWTToken)



/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))
app.use("/site-name/inv", require("./routes/inventoryRoute"))

// Account Routes
app.use("/account", require("./routes/accountRoute"))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

//************** */ In your route for handling login ***************
app.get('/', (req, res) => {
  // Determine the loggedIn status based on your authentication logic
  const loggedIn = req.session.loggedIn || false;

  // Render the template and pass the loggedIn variable as a local variable
  res.render('index', { loggedIn });
})
app.post('/login', (req, res) => {
  // Perform authentication and set loggedIn status
  req.session.loggedIn = true;
  // Other login logic
})

// In your route for handling logout
app.post('/logout', (req, res) => {
  // Clear session and remove loggedIn status
  req.session.destroy();
  // Other logout logic
})
// ***********************************************************************



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})




/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
