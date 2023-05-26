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

// 505 Error Link
async function errorOnPurpose(){
  try{
    fakeFunction()

   return
} catch (error){
  console.error("erroronpurpose" + error)
}
}




module.exports = {getClassifications, getInventoryByClassificationId, getInventory };