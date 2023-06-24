// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to deliver inventory view
router.get("/detail/:invId", utilities.handleErrors(invController.deliverInventory))

// Error
router.get("/error", utilities.handleErrors(invController.makeAnError))

// Route to management view
router.get("/",utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView))

// Route to add-classifications view
router.get("/add-classification",utilities.checkAccountType, utilities.handleErrors(invController.addClassification))
router.post("/process-classification",utilities.checkAccountType, utilities.handleErrors(invController.processClassification))

// Route to add-inventory
router.get("/add-inventory",utilities.checkAccountType,  utilities.handleErrors(invController.addInventory))
router.post("/process-inventory",utilities.checkAccountType, utilities.handleErrors(invController.processInventory))

// Route that works with inventory.js
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Modify inventory Route
router.get("/edit/:invID",utilities.checkAccountType,  utilities.handleErrors(invController.modifyInventory))
router.post("/update/",utilities.checkAccountType,  utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_ID",utilities.checkAccountType,  utilities.handleErrors(invController.deleteInventory))
router.post("/newupdate/",utilities.checkAccountType,  utilities.handleErrors(invController.processdelete))


  

module.exports = router;