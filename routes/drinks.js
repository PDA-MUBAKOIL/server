var express = require("express");
var router = express.Router();
const Drink = require("../model/Drinks");

/* GET : drinks listing. */
router.get("/", function (req, res, next) {
  Drink.find().then((data) => {
    res.json(data);
  }).catch((err) => {
    res.status(404).json({ error: 'Do not get drink list' });
    next(err);
  });
});

/* GET : drink detail */
router.get("/:drinkId", function (req, res, next) {
  const drinkId = req.params.drinkId;

  Drink.findById(drinkId).then((data) => {
    res.json(data);
  }).catch((err) => {
    res.status(404).json({ error: 'Do not get drinkId' });
    next(err);
  }); 
});

module.exports = router;
