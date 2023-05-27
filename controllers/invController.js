const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}



/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Deliver Inventory View
 * ************************** */
invCont.deliverInventory = async function (req, res, next) {
  const inventory_id = req.params.invId
  const data = await invModel.getInventory(inventory_id)
  const newView = await utilities.buildViewIndividualCar(data)
  let nav = await utilities.getNav()
  res.render("./inventory/individualCar", {
    title: inventory_id + " vehicles",
    nav,
    newView,
  })
}

/* ***************************
 *  Link to 500 Error
 * ************************** */
// invCont.linkToError = async function (req, res, next) {
//   const inventory_id = req.params.err
//   const getCar = await invModel.errorOnPurpose()
//   const newView = await utilities.buildViewIndividualCar(getCar)
//   let nav = await utilities.getNav()
//   const invenid = getCar[0].inv_id
//   res.render("./inventory/linktoerror", {
//     title: invenid + " vehicles",
//     nav,
//     newView,
//   })
// }

module.exports = invCont
