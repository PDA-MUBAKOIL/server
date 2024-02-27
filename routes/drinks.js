var express = require("express");
var router = express.Router();
const Drink = require("../model/Drinks");
const Brewer = require("../model/Brewer");


/* GET : search */
router.get("/search", async function (req, res, next) {
  try {
    const { tag, percent, name, region } = req.query;
    
    // Create a query object based on the provided parameters
    const query = {};
    if (tag) {
      query.tags = tag; // 문자열 하나인 경우, 바로 사용
    }
    if (percent) {
      const percentValue = parseFloat(percent);
      if (!isNaN(percentValue)) {
        // 오차범위 설정 (예: ±3%)
        query.spercent = { $gte: percentValue - 3, $lte: percentValue + 3 };
      }
    }
    if (name) {
      // 이름 부분 검색을 위해 정규 표현식 사용
      query.name = { $regex: name };
    }
    if(region){
      query.region = region;
    }
    
    // Perform the search
    await Drink.find(query).populate('brewerId').then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      res.status(404).json({result: false});
    });
  } catch (error) {
    res.status(500).json({ result:false });
  }
});

/* GET : drinks listing. */
router.get("/", function (req, res, next) {
  Drink.find().populate('brewerId').then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(404).json({ result : false });
  });
});

/* GET : drink detail */
router.get("/:drinkId", function (req, res, next) {
  const drinkId = req.params.drinkId;

  Drink.findById(drinkId).populate("brewerId").then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(404).json({ result : false });
  });
});

module.exports = router;
