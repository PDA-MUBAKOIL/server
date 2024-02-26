var express = require("express");
var router = express.Router();
const Drink = require("../model/Drinks");
const Brewer = require("../model/Brewer");

/* GET : drinks listing. */
router.get("/", function (req, res, next) {
  Drink.find()
    .populate("brewerId")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ result: "false" });
    });
});

/* GET : drink detail */
router.get("/:drinkId", function (req, res, next) {
  const drinkId = req.params.drinkId;

  Drink.findById(drinkId)
    .populate("brewerId")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ result: false });
    });
});

/* GET : drink search */
router.get("/search", function (req, res, next) {
  
  Drink.find().populate("brewerId").then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(404).json({ error: err.message });
  });

});

module.exports = router;
