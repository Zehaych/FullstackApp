const express = require("express");
const router = express.Router();
const foodRequestController = require("../controllers/foodRequestController");

//foodRequest => GET
router.get('/getFoodRequests', foodRequestController.getFoodRequests);


//foodRequest => POST
router.post('/createFoodRequest', foodRequestController.createFoodRequest);

//foodRequest => PUT
router.put('/rejectFoodRequest/:id', foodRequestController.rejectFoodRequest);
router.put('/approveFoodRequest/:id', foodRequestController.approveFoodRequest);

module.exports = router;