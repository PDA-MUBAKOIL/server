var express = require("express");
var router = express.Router();
const Drink = require("../model/Drinks");

/* GET drinks listing. */
router.get("/", function (req, res, next) {
  Drink.find().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(err);
  });
});

/* GET drink detail */
router.get("/:drinkId", function (req, res, next) {
  const drinkId = req.params.drinkId;

  Drink.findById(drinkId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(err);
  }); 
});
