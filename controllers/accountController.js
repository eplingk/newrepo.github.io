// Deliver Login view activity
const utilities = require('../utilities/')
const accModel = require("../models/account-model")
// require bcryptjs package
const bcrypt = require("bcryptjs")
// require "jsonwebtoken" and "dotenv" packages
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  

  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/account", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/account", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("./management")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

   /* ****************************************
*  Deliver Logged-In view
* *************************************** */
async function buildloggedIn(req, res, next) {
  let nav = await utilities.getNav()
  const message_to = res.locals.accountData.account_id
  let unread = await accModel.getUnreadCount(message_to)
  res.render("account/loggedIn", {
    title: "You're logged in",
    nav,
    message_to,
    unread,
    errors: null,
  })
}

/* ****************************************
*  Account Update View
* *************************************** */
async function buildUpdateForms(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update-account", {
    title: "Update Your Account",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function processUpdate(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email } = req.body
  const account_id = res.locals.accountData.account_id

  const account = await accModel.getAccountByID(account_id)

  if (account) {
    const updateResult = await accModel.updateAccountInformation(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      req.flash(
        "notice",
        `Thank you, ${account_firstname}. Your account information has been updated.`
      )
      res.status(201).render("account/loggedIn", {
        title: "You're logged in",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, your information failed to update.")
      res.status(501).render("account/update-account", {
        title: "Update Your Account",
        nav,
        errors: null,
      })
    }
  } else {
    req.flash("notice", "Sorry, your account was not found.")
    res.status(404).render("account/update-account", {
      title: "Update Your Account",
      nav,
      errors: null,
    })
  }
}


  /* ****************************************
*  Process New Password
* *************************************** */
async function processNewPassword(req, res) {
  let nav = await utilities.getNav()
  const {account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error resetting your new password.')
    res.status(500).render("account/update-account", {
      title: "Update Your Account",
      nav,
      errors: null,
    })
  }

  const regResult = await accModel.updateAccountPassword(
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Your new password has been reset.`
    )
    res.status(201).render("account/loggedIn", {
      title: "Update Your Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, we failed to reset your password.")
    res.status(501).render("account/update-account", {
      title: "Update Your Account",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Build Inbox View
* *************************************** */
async function buildInbox(req, res){
  let nav = await utilities.getNav()
  const message_to = res.locals.accountData.account_id
  let getMessage = await accModel.getMessage(message_to)
  let inbox = await utilities.messageInbox(message_to)
  res.render("account/inbox", {
    title: "Inbox",
    nav,
    message_to,
    getMessage,
    inbox,
    errors: null,
  })
}

/* ****************************************
*  Build Individual Message View
* *************************************** */
async function readMessage(req, res){
  let nav = await utilities.getNav()
  const messageId = req.params.messageId
  const data = await accModel.messageBody(messageId)
  const individualMessage = await utilities.buildindividualMessage(data)
  let subject = data[0].message_subject
  console.log(data[0].message_subject)
  console.log(messageId + "##########################")
  res.render("account/reading-message", {
    title: subject,
    nav,
    individualMessage,
    messageId,
    errors: null,
  })
}

  /* ****************************************
*  Build New Message
* *************************************** */
async function buildNewMessage(req, res){
  let nav = await utilities.getNav()
  let getAccounts = await accModel.getAccounts()
  let userList = await utilities.userList()
  res.render("account/newMessage", {
    title: "Create a new Message",
    nav,
    getAccounts,
    userList,
    errors: null,
  })
}

  /* ****************************************
*  Process The Sending of The Message
* *************************************** */
async function sendNewMessage(req, res) {
  let nav = await utilities.getNav()
  const {message_subject,message_body, message_to, message_from} = req.body
  const regResult = await accModel.sendMessage(message_subject, message_body, message_to, message_from)
  let inbox = await utilities.messageInbox(message_to)
  if (regResult) {
    req.flash(
      "notice",
      `Your message has been sent.`
    )
    res.status(201).render("account/inbox", {
      title: "Your inbox",
      nav,
      inbox,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, we failed to send your message.")
    res.status(501).render("account/newMessage", {
      title: "Create a New Message",
      nav,
      errors: null,
    })
  }
}



  /* ****************************************
*  Build Archived Messages
* *************************************** */
async function buildArchivedMessages(req, res){
  let nav = await utilities.getNav()
  const message_to = res.locals.accountData.account_id
  let getMessage = await accModel.getArchivedMessage(message_to)
  let saved = await utilities.ArchivedInbox(message_to)
  res.render("account/archivedMessages", {
    title: "Your Archived Messages",
    nav,
    message_to,
    getMessage,
    saved,
    errors: null,
  })
}

/* ****************************************
 *  Reply Message
 * *************************************** */
async function buildReplyMessage(req, res) {
  console.log("HIIIIIIIIIIIIIIIIIIII")
  const nav = await utilities.getNav()
  // const message_to = res.locals.accountData.account_id
  const messageId = req.params.messageId
  const getAccounts = await accModel.getAccounts()
  const message = await accModel.messageBody(messageId)
  const userList = await utilities.userList()
  console.log(message[0].message_subject + "     WHAT?")
  console.log(messageId + "!!!!!!!!!!!!!!!!!" )
  console.log(message[0].message_to)
  console.log(message[0].message_body)
  console.log(message[0].message_from)
  const replyMessage = {
    message_to: message[0].message_from,
    message_subject: `Re: ${message[0].message_subject}`,
    message_body: message[0].message_body
    
  }

  res.render("account/replyMessage", {
    title: "Reply Message",
    nav,
    getAccounts,
    userList,
    replyMessage,
    messageId,
    errors: null
  })
}





  /* ****************************************
*  Mark As Read
* *************************************** */
async function markRead(req, res) {
  console.log("FOR CRYING OUT LOUD11111111111111111")
  let nav = await utilities.getNav()
  const messageId = req.params.messageId
  console.log(messageId + " AAAAAAAAAAAAAAAAAAAAH")
  const mark = await accModel.markMessageAsRead(messageId)
  const data = await accModel.messageBody(messageId)
  const individualMessage = await utilities.buildindividualMessage(data)
  let subject = data[0].message_subject

  if (mark) {
    req.flash("notice", "Message has been marcked as read.");
  } else {
    req.flash("notice", "Sorry, we could not mark this message as read.");
  }
  
    res.render("account/reading-message", {
      title: subject,
      nav,
      mark,
      individualMessage,
      messageId,
      errors: null
    })
  }
 


/* ****************************************
*  Delete Message
* *************************************** */
async function deleteMessage(req, res) {
  const messageId = req.params.messageId;
  const deleteResult = await accModel.deleteMessage(messageId);

  if (deleteResult) {
    req.flash("notice", "Message was successfully deleted.");
  } else {
    req.flash("notice", "Sorry, the deletion failed.");
  }
  
  res.redirect("/account/inbox");
}

/* ****************************************
*  Archive Message
* *************************************** */
async function archiveMessage(req, res) {
  const messageId = req.params.messageId;
  const archived = await accModel.markMessageAsArchived(messageId);

  if (archived) {
    req.flash("notice", "Message was successfully archived.");
  } else {
    req.flash("notice", "Sorry, the message couldn't be archived.");
  }
  
  res.redirect("/account/inbox");
}


/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie('jwt');
  res.redirect('/');
}




  
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildloggedIn, buildUpdateForms,processUpdate,
     processNewPassword,buildInbox, readMessage,markRead,buildReplyMessage,deleteMessage,archiveMessage,
     buildNewMessage,buildArchivedMessages,sendNewMessage, accountLogout }