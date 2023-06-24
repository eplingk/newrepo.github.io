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
      const classificationSelect = await invModel.getClassifications()
      let list = await utilities.classList()
      res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        nav,
        classificationSelect,
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
  const classificationSelect = await invModel.getClassifications()
  let list = await utilities.classList()
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
    classificationSelect,
    list,
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
  let nav = await utilities.getNav()
  const classificationSelect = await invModel.getClassifications()
  let list = await utilities.classList()
  res.render("./inventory/add-inventory", {
    title: "Add to Inventory",
    nav,
    classificationSelect,
    list,
    errors: null,
  })
}

/* ****************************************
*  Process new Inventory
* *************************************** */
 invCont.processInventory = async function (req, res, next) {
   let nav = await utilities.getNav()
   const classificationSelect = await invModel.getClassifications()
  let list = await utilities.classList()
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
    classificationSelect,
    list,
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
  const list = await invModel.getClassifications()
  const itemData = await invModel.getInventory(inv_id)
  const classificationSelect = await utilities.classList(itemData.classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    list,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ****************************************
*  Process updated Inventory
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.classList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    
   
    })
  }
}

/* ***************************
 *  Deliver Delete Inventory View (confimation)
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_ID)
  let nav = await utilities.getNav()
  const list = await invModel.getClassifications()
  const itemData = await invModel.getInventory(inv_id)

  const classificationSelect = await utilities.classList(itemData.classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    list,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}


/* ****************************************
*  Process deleted Inventory
* *************************************** */
invCont.processdelete = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    classification_id
  } = req.body

  // Get the item details before deleting it
  const itemData = await invModel.getInventory(inv_id)
  const {
    inv_make,
    inv_model
  } = itemData[0]

  const deleteResult = await invModel.processdelete(inv_id)

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.classList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      classification_id
    })
  }
}







/* ***************************
 *  This returns a 500 error
 * ************************** */
invCont.makeAnError = async function (req, res, next){
  res.status(500).render("")
}




module.exports = invCont
