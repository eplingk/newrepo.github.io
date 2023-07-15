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

// Update account View
router.get("/update-account", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateForms))

// Inbox View
router.get("/inbox", utilities.checkLogin, utilities.handleErrors(accountController.buildInbox))

// New Message View
router.get("/new-message", utilities.checkLogin, utilities.handleErrors(accountController.buildNewMessage))

// Reading Retreived Message View
router.get("/reading-message/:messageId", utilities.checkLogin, utilities.handleErrors(accountController.readMessage))

// Reply View
router.get("/reply-message/:messageId", utilities.checkLogin, utilities.handleErrors(accountController.buildReplyMessage))

// Mark Message as Read
router.get("/mark-read/:messageId", utilities.checkLogin, utilities.handleErrors(accountController.markRead))

// Saved Messages View
router.get("/archived-messages", utilities.checkLogin, utilities.handleErrors(accountController.buildArchivedMessages))

// Mark as Archived
router.get("/archive-mesage/:messageId", utilities.checkLogin, utilities.handleErrors(accountController.archiveMessage))

// Delete message
router.get("/delete-message/:messageId", utilities.checkLogin, utilities.handleErrors(accountController.deleteMessage))


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

// Process the update-account forms
router.post(
  "/update-account",
    // regValidate.updateRules(),
    utilities.handleErrors(accountController.processUpdate)
)

router.post(
  "/update-account",
    // regValidate.newPasswordRules(),
    utilities.handleErrors(accountController.processNewPassword)
)

router.post(
  "/new-message",
  utilities.checkLogin,
  // regValidate.validateRecipient,
    utilities.handleErrors(accountController.sendNewMessage)
)

router.post(
  "/reply-message",
  utilities.checkLogin,
  // regValidate.validateRecipient,
    utilities.handleErrors(accountController.sendNewMessage)
)


router.get('/logout', accountController.accountLogout)

module.exports = router;