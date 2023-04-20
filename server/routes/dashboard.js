const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/checkAuth");
const dashboardController = require("../controllers/dashboardController");

//routes
router.get("/dashboard", isLoggedIn, dashboardController.dashboard);
router.get("/dashboard/item/:id",isLoggedIn,dashboardController.dashboardViewNote);
router.get("/dashboard/add",isLoggedIn,dashboardController.dashboardAddNote);
router.get("/dashboard/search",isLoggedIn,dashboardController.dashboardSearch);

//main submission routes 
router.put("/dashboard/item/:id",isLoggedIn,dashboardController.dashboardUpdateNote);
router.delete("/dashboard/item/:id",isLoggedIn,dashboardController.dashboardDeleteNote);
router.post("/dashboard/add",isLoggedIn,dashboardController.dashboardAddNoteSubmit);
router.post("/dashboard/search",isLoggedIn,dashboardController.dashboardSearchSubmit);

module.exports = router;

