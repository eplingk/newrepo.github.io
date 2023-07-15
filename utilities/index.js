const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
      grid += '<hr />'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the individual car view HTML
* ************************************ */
Util.buildViewIndividualCar = async function(data){
  let newView
  if(data.length > 0){
    newView = '<div class="singleCarView">'
    data.forEach(vehicle => { 
      newView += '<li>'
      newView +=  '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" />'
      newView += '<div class="carInfo">'
      newView += '<h2>'
      newView += vehicle.inv_make + ' ' + vehicle.inv_model 
      newView += '</h2>'
      newView += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      newView += '<p>' + vehicle.inv_description + '</p>'
      newView += 'Year:' + vehicle.inv_year + ' | '
      + '  Color available:' + vehicle.inv_color + ' | ' + '  Mileage:' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
      newView += '</div>'
      newView += '</li>'

    })
    newView += '</div>'
  } else { 
    newView += '<p class="notice">Oops, this view could not be found.</p>'
  }
  return newView
}


/* ************************
 * Classifications Dropdown Menu
 ************************** */
Util.classList = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<select id="classificationList" name="classification_id">'
  list += '<option> Select a Clasification </option>'
  data.rows.forEach((row) => {
    
    list += '<option value="' + row.classification_id + '">' + row.classification_name +'</option>'
  })
  list += "</select>"
  return list
}

/* ************************
 * Userlist Dropdown Menu
 ************************** */
Util.userList = async function (req, res, next) {
  let data = await accModel.getAccounts()
  let list = '<select id="userList" name="message_to" required>'
  list += '<option> Select a Recipient </option>'
  data.rows.forEach((row) => {
    
    list += '<option value="' + row.account_id + '">' + row.account_lastname + ', ' + row.account_firstname +'</option>'
  })
  list += "</select>"
  return list
}

/* **************************************
* Build inbox table
* ************************************ */
Util.messageInbox = async function (message_to) {
  let data = await accModel.getMessage(message_to)
  let inbox = ''

  if (Array.isArray(data) && data.length > 0) {
    inbox += '<div>'
    inbox += '<table class="inboxTable">'
    inbox += '<tr>'
    inbox += '<th><h1>Received</h1></th>'
    inbox += '<th><h1>Subject</h1></th>'
    inbox += '<th><h1>From</h1></th>'
    inbox += '<th><h1>Read</h1></th>'
    inbox += '</tr>'

    data.forEach(row => {
      inbox += '<tr>'
      inbox += '<td>' + new Date(row.message_created).toLocaleString() + '</td>'
      inbox += '<td>' + '<a href="/account/reading-message/' + row.message_id + '">' + row.message_subject + '</a>' + '</td>'
      if (row.message_from === 3) {
        inbox += '<td>Client, Basic</td>'
      } else if (row.message_from === 4) {
        inbox += '<td>Employee, Happy</td>'
      } else if (row.message_from === 5) {
        inbox += '<td>User, Manager</td>'
      } else {
        inbox += '<td>' + row.message_from + '</td>'
      }
      inbox += '<td>' + row.message_read + '</td>'
      inbox += '</tr>'
    })

    inbox += '</table>'
    inbox += '</div>'
  } else {
    inbox += '<p class="notice">No messages found.</p>'
  }

  return inbox
}

/* **************************************
* Build Archived table
* ************************************ */
Util.ArchivedInbox = async function (message_to) {
let data = await accModel.getArchivedMessage(message_to)
let saved = ''

  if (Array.isArray(data) && data.length > 0) {
    saved += '<div>'
    saved += '<table class="inboxTable">'
    saved += '<tr>'
    saved += '<th><h1>Received</h1></th>'
    saved += '<th><h1>Subject</h1></th>'
    saved += '<th><h1>From</h1></th>'
    saved += '<th><h1>Read</h1></th>'
    saved += '</tr>'

    data.forEach(row => {
      saved += '<tr>'
      saved += '<td>' + new Date(row.message_created).toLocaleString() + '</td>'
      saved += '<td>' + '<a href="/account/reading-message/' + row.message_id + '">' + row.message_subject + '</a>' + '</td>'
      if (row.message_from === 3) {
        saved += '<td>Client, Basic</td>'
      } else if (row.message_from === 4) {
        saved += '<td>Employee, Happy</td>'
      } else if (row.message_from === 5) {
        saved += '<td>User, Manager</td>'
      } else {
        saved += '<td>' + row.message_from + '</td>'
      }
      saved += '<td>' + row.message_read + '</td>'
      saved += '</tr>'
    })

    saved += '</table>'
    saved += '</div>'
  } else {
    saved += '<p class="notice">No messages found.</p>'
  }

  return saved
}


/* **************************************
* Individual Message
* ************************************ */
Util.buildindividualMessage= async function (data) {
  let message
  if(data.length > 0){
    message = ''
    data.forEach(row => { 
      message += '<li> <b>Subject:</b>' + row.message_subject + '</li>'
      if (row.message_from === 3) {
        message += '<li> <b>From:</b> Client, Basic</li>'
      } else if (row.message_from === 4) {
        message += '<li> <b>From:</b> Employee, Happy</li>'
      } else if (row.message_from === 5) {
        message += '<li> <b>From:</b> User, Manager</li>'
      } else {
        message += '<li> <b>From:</b>' + row.message_from + '</li>'
      }
      message += '<li> <b>Message:</b>' + row.message_body + '</li>'
    })
    
   
    
  } else { 
    message += '<p class="notice">Oops, something went wrong when loading the message.</p>'
  }
  return message
}




/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/account")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1

     
    
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/account")


  }
 }

 /* ****************************************
 *  Check Account Type
 * ************************************ */
 Util.checkAccountType = async (req, res, next) => {
  let accountType = res.locals.accountData.account_type
  if (accountType === 'Admin' || accountType === 'Employee') {
    next()
  } else {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}




module.exports = Util