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
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account found");
  }
}

/* *****************************
* Update account information
* ***************************** */
async function updateAccountInformation(account_id, firstname, lastname, email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4";
    return await pool.query(sql, [firstname, lastname, email, account_id]);
  } catch (error) {
    return error.message;
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
    console.log(message_subject + "**************************************")
    console.log(message_body)
    console.log(message_to)
    console.log(message_from)
    const sql = "INSERT INTO message (message_subject,message_body,message_to,message_from) VALUES($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [message_subject,message_body,message_to,message_from])
  } catch (error) {
    return error.message
  }
}


  module.exports = {registerAccount, checkExistingEmail, checkExistingPassword, getAccountByEmail,getAccountByID,updateAccountInformation, updateAccountPassword, getAccounts, sendMessage};