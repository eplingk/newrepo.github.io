const invModel = require("../models/inventory-model")
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
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
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
Util.buildViewIndividualCar = async function(getCar){
  let newView =
  '<p>This is suppossed to be a close-up pic and more info</p>'
  // if(getCar.length > 0){
  //   // *****CREATE A NEW GRID, ONE THAT JUST SHOWS ONE CAR AND ITS INFO****
  //     newGrid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
  //     + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
  //     + 'details"><img src="' + vehicle.inv_thumbnail 
  //     +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
  //     +' on CSE Motors" /></a>'
  //     newGrid += '<div class="namePrice">'
  //     newGrid += '<hr />'
  //     newGrid += '<h2>'
  //     newGrid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
  //     + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
  //     + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
  //     newGrid += '</h2>'
  //     newGrid += '<span>$' 
  //     + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
  //     newGrid += '</div>'
  //   }
  
  return newView
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)




module.exports = Util