// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to deliver inventory view
router.get("/detail/:invId", invController.deliverInventory);

// Route to 500 error
// router.get("/type/:err", invController.linkToError);

module.exports = router;