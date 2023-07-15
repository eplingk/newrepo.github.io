const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
body("account_email")
.trim()
.isEmail()
.normalizeEmail() // refer to validator.js docs
.withMessage("A valid email is required.")
.custom(async (account_email) => {
  const emailExists = await accountModel.checkExistingEmail(account_email)
  if (emailExists){
    throw new Error("Email exists. Please log in or use different email")
  }
}),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }



/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [

    // valid email is required and cannot already exist in the database
body("account_email")
.trim()
.isEmail()
.normalizeEmail() // refer to validator.js docs
.withMessage("A valid email is required.")
.custom(async (account_email) => {
const emailExists = await accountModel.checkExistingEmail(account_email)
if (!emailExists){
  throw new Error("That email is not registered with us. Try a different one or make an account.")
}
}),

    // password is required and must be strong password
    body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Incorrect credentials"),
  ]
}

  /* ******************************
 * Check data and return errors or continue with login
 * ***************************** */
  validate.checkLoginData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/account", {
        errors,
        title: "Log in",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /*  **********************************
 *  New Password Rules
 * ********************************* */
validate.newPasswordRules = () => {
  return [
  // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

  /*  **********************************
 *  Account Update Rules
 * ********************************* */
  validate.updateRules = () => {
    return [
      // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email, { req }) => {
          const account_id = req.body.account_id // Assuming account_id is passed in the request body
          const account = await accountModel.getAccountByID(account_id)
  
          // Check if submitted email is same as existing
          if (account_email !== account.account_email) {
            // No - Check if new email exists in table
            const emailExists = await accountModel.checkExistingEmail(account_email)
            // Yes - throw error
            if (emailExists) {
              throw new Error("Email exists. Please login or use a different email.")
            }
          }
        })
    ]
  }


  // Make sure when sending a message, user chooses an actual recipient
  validate.validateRecipient = (value) => {
  if (value === "") {
    throw new Error("Please select a recipient.");
  }
  return true
}
  
  
  module.exports = validate