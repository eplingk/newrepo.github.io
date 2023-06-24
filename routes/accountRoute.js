// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')



// Deliver Login View
router.get("/account", utilities.handleErrors(accountController.buildLogin))

// Deliver Resistration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Account Management
router.get("/management", utilities.checkLogin, utilities.handleErrors(accountController.buildloggedIn))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/account",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )


router.get('/logout', accountController.accountLogout)

module.exports = router;