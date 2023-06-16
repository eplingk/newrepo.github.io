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
    errors: null,
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
    title: data[0].inv_make + " " + data[0].inv_model,
    nav,
    newView,
    errors: null,
  })
}

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let list = await utilities.classList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    list,
    errors: null,

  })
}

/* ***************************
 *  Add New Classification View
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process new Classification
* *************************************** */
invCont.processClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

const regResult = await invModel.addClassitem(
  classification_name
)

if (regResult) {
  req.flash(
    "notice",
    `Thank you, the classification ${classification_name} has been added.`
  )
  res.status(201).render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
} else {
  req.flash("notice", "Sorry, the registration failed.")
  res.status(501).render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}
}


/* ***************************
 *  Add New Inventory View
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let list = await utilities.classList()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add to Inventory",
    nav,
    list,
    errors: null,
  })
}

/* ****************************************
*  Process new Inventory
* *************************************** */
 invCont.processInventory = async function (req, res, next) {
   let nav = await utilities.getNav()
  const {inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,
    inv_color,classification_id } = req.body
const addInventFlash = await invModel.addInventoryItem(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
)
if (addInventFlash) {
  req.flash(
    "notice",
    `Thank you. ${inv_make, inv_model} has been successfully added to the inventory.`
  )
  res.status(201).render("./inventory/management", {
    title: "Management Options",
    nav,
    errors: null,
  })
} else {
  req.flash("notice", "Sorry, this failed to be added to the inventory.")
  res.status(501).render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
  })
}
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Deliver Modify Inventory View
 * ************************** */
invCont.modifyInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.invID)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventory(inv_id)
  const classificationSelect = await utilities.classList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}





/* ***************************
 *  This returns a 500 error
 * ************************** */
invCont.makeAnError = async function (req, res, next){
  res.status(500).render("")
}




module.exports = invCont
