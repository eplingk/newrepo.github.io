const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory data
 * ************************** */
async function getInventory(){
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id")
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

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getItemByInventoryId(inventory_id) {
  try {
    const getCar = await pool.query(
      "SELECT * FROM public.inventory As i JOIN public.inventory AS c ON i.inventory_id = c.inventory_id WHERE i.inventory_id = $1",
      [inventory_id]
    )
    return getCar.rows
  } catch (error) {
    console.error("getitembyinventoryid error " + error)
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getInventory,getItemByInventoryId };