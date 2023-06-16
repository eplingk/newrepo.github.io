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
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to add-classifications view
router.get("/add-classification", utilities.handleErrors(invController.addClassification))
router.post("/process-classification", utilities.handleErrors(invController.processClassification))

// Route to add-inventory
router.get("/add-inventory", utilities.handleErrors(invController.addInventory))
router.post("/process-inventory", utilities.handleErrors(invController.processInventory))

// Route that works with inventory.js
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Modify inventory Route
router.get("localhost:5500/inv/edit/:invID", utilities.handleErrors(invController.modifyInventory))


  

module.exports = router;