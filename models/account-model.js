const { json } = require("body-parser")
const pool = require("../database/")


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }


  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    console.log(JSON.stringify(email))
    return email.rowCount
    
  } catch (error) {
    return error.message
  }
}

  /* **********************
 *   Check for existing password
 * ********************* */
  async function checkExistingPassword(account_password){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const password = await pool.query(sql, [account_password])
      return password.rowCount
    } catch (error) {
      return error.message
    }
  }

  /* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account ID
* ***************************** */
async function getAccountByID(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account information
* ***************************** */
async function updateAccountInformation(account_id, firstname, lastname, email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4"
    return await pool.query(sql, [firstname, lastname, email, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update account password
* *************************** */
async function updateAccountPassword(account_id, new_password){
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2"
    return await pool.query(sql, [new_password, account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all account data
 * ************************** */
async function getAccounts(){
  return await pool.query("SELECT * FROM public.account ORDER BY account_firstname")
  
}

/* *****************************
*   Sending Message
* *************************** */
async function sendMessage(message_subject,message_body,message_to,message_from){
  try {
    const sql = "INSERT INTO message (message_subject,message_body,message_to,message_from) VALUES($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [message_subject,message_body,message_to,message_from])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Retrieve Message
* *************************** */
async function getMessage(message_to) {
  try {
    const sql = "SELECT * FROM message WHERE message_to = $1 AND message_archived = 'false'"
    const result = await pool.query(sql, [message_to])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*  Retrieve Archived Messages
* *************************** */
async function getArchivedMessage(message_to) {
  try {
    const sql = "SELECT * FROM message WHERE message_to = $1 AND message_archived = 'true'"
    const result = await pool.query(sql, [message_to])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Count Unread Messages
* *************************** */
async function getUnreadCount(message_to) {
  try {
    const sql = "SELECT COUNT(message_read) FROM message WHERE message_to = $1 AND message_read = false"
    const result = await pool.query(sql, [message_to])
    return result.rows[0].count
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get message Body by Id
 * ************************** */
async function messageBody(message_id){
  try{
    const data = await pool.query("SELECT * FROM public.message where message_id = $1", [message_id])
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Delete Message
 * ************************** */
async function deleteMessage(message_id) {
  try {
    const sql = 'DELETE FROM message WHERE message_id = $1'
    const data = await pool.query(sql, [message_id])
  return data
  } catch (error) {
    return error.message
  }
}
 
/* ***************************
 *  Mark Message as Read
 * ************************** */
async function markMessageAsRead(messageId) {
  try {
    const sql = 'UPDATE message SET message_read = true WHERE message_id = $1'
    const data = await pool.query(sql, [messageId])
    return data
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Mark Message as Archived
 * ************************** */
async function markMessageAsArchived(messageId) {
  try {
    const sql = 'UPDATE message SET message_archived = true WHERE message_id = $1'
    const data = await pool.query(sql, [messageId])
    return data
  } catch (error) {
    return error.message
  }
}





  module.exports = {registerAccount, checkExistingEmail, checkExistingPassword,getAccountByEmail,getAccountByID,
    updateAccountInformation, updateAccountPassword,getAccounts, sendMessage, getMessage,getUnreadCount,
     messageBody,getArchivedMessage,deleteMessage,markMessageAsRead,markMessageAsArchived
    }