const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory data by id
 * ************************** */
async function getInventory(inventory_id){
  try{
    const data = await pool.query("SELECT * FROM public.inventory where inv_id = $1", [inventory_id])
    return data.rows
  } catch (error) {
    console.error("getinventory error " + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory As i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* *****************************
*   Create new classification
* *************************** */
async function addClassitem(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Create new inventory item
* *************************** */
async function addInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try { 
    console.log("This is inv_make " + inv_make)
    console.log("This is inv_model " + inv_model)
    console.log("This is inv_year " + inv_year)
    console.log("This is inv_description " + inv_description)
    console.log("This is inv_image " + inv_image)
    console.log("This is inv_thumbnail " + inv_thumbnail)
    console.log("This is inv_price " + inv_price)
    console.log("This is inv_miles " + inv_miles)
    console.log("This is inv_color " + inv_color)
    console.log("This is classification_id" + classification_id)

    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getInventory, addClassitem, addInventoryItem };