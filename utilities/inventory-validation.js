const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}



/*  **********************************
 *  New Classification Rules
 * ********************************* */
validate.newClassificationRule = () => {
    return [
     
  body("classification_name")
  
  .custom(async (classification_name) => {
  const classExists = await invModel.checkExistingClassification(classification_name)
  if (classExists){
    throw new Error("That classification already exists. Try a different name.")
  }
  })
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkNewClass = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }


  /* ******************************
 * Check data and return errors or continue with login
 * ***************************** */
  validate.checkNewInventory = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add to Inventory",
        nav,
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
      return
    }
    next()
  }


  
  module.exports = validate