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
  let newView
  if(getCar.length > 0){
    newView = '<div class="singleCarView">'
    getCar.forEach(vehicle => { 
      newView =+ '<h1>' + vehicle.inv_make + '</h1>'
      newView =+ '<img src="' + vehicle.inv_image
      grid += '<span>$'
      newView =+ new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      newView =+ '<p>' + vehicle.inv_model + ' ' + vehicle.inv_year + '</p>'
      newView =+ '<p>' + vehicle.color + ' ' + vehicle.inv_miles + '</p>'
      newView =+ '<p>' + vehicle.inv_description + '</p>'

    })
    newView += '</div>'
  } else { 
    newView += '<p class="notice">Oops, this view could not be found.</p>'
  }
  return newView
}

// Util.linkToError = async function(){
//   let errorOnPurpose()
// }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)




module.exports = Util