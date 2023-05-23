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
  const getCar = await invModel.getItemByInventoryId(inventory_id)
  const newView = await utilities.buildViewIndividualCar(getCar)
  let nav = await utilities.getNav()
  const className = getCar[0].inv_id
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    newView,
  })
}

module.exports = invCont