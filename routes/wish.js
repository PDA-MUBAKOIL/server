var express = require("express");
var router = express.Router();
const Wish = require("../model/Wish");
//const Drinks = require("../model/Drinks");

// /* GET : 나의 위시에 있는 술 지역별 개수 조회 */
// router. get('/:userId/regioncnt', async(req,res,next)=>{
//     try {
//         const userId = req.params.userId;

//         // Use your ORM or database library to query the database
//         const regionCounts = await Drinks.aggregate([
//             { $match: { userId: userId } },
//             {
//                 $group: {
//                     _id: '$region',
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0, // Exclude the default MongoDB _id field
//                     region: '$_id',
//                     count: 1
//                 }
//             }
//         ]);

//         // Construct the result object directly
//         const result = {};
//         regionCounts.forEach((regionCount) => {
//             result[regionCount.region] = regionCount.count;
//         });
//         res.json(result);

//     } catch (error) {
//         console.error(error);
//         //res.json({ result: false });
//     }
// });

/* GET : 나의 위시 전체 조회 + 해당 지역별 위시 조회 */
router.get("/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const region = req.query.region;

    const query = { userId: userId };
    const populatedMatched = {};
    if (region) {
      populatedMatched["region"] = region;
    }
    // Perform the search
    const wishes = await Wish.find(query).populate({
      path: "drinkId",
      match: populatedMatched,
    });
    const filteredWishes = wishes.filter((wish) => wish.drinkId !== null);
    res.status(200).json(filteredWishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false });
  }
});

/* GET: 해당 술에 대한 전체 리뷰 조회 */
router.get("/review/:drinkId", function (req, res, next) {
  const drinkId = req.params.drinkId;
  Wish.find({ drinkId: drinkId })
    .populate("drinkId")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      //res.status(404).json({ result: false });
    });
});

/* GET : 해당 술에 대한 나의 리뷰 조회 */
router.get("/:drinkId/:userId", (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.params.userId;

  Wish.findOne({
    drinkId: drinkId,
    userId: userId,
  })
    .populate("drinkId")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.json({ result: false });
    });
});

/* DELETE : 해당 술에 대한 나의 리뷰 삭제 */
router.delete("/:drinkId/:userId", async (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.params.userId;

  Wish.deleteOne({
    userId: userId,
    drinkId: drinkId,
  })
    .then((data) => {
      res.json({ result: true });
    })
    .catch((err) => {
      res.json({ result: false });
      next(err);
    });
});

/* PUT : 해당 술에 대한 나의 리뷰 수정 */
router.put("/:drinkId/:userId", (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.params.userId;
  const { review, imgUrl, isPublic } = req.body;

  Wish.updateOne(
    {
      drinkId: drinkId,
      userId: userId,
    },
    { review, imgUrl, isPublic }
  )
    .then(() => {
      return Wish.findOne({ drinkId: drinkId, userId: userId }).populate("drinkId");
    })
    .then((updatedData) => {
      res.json(updatedData);
    })
    .catch((err) => {
      res.json({ result: false });
      next(err);
    });
});

/* POST : 해당 술에 대한 나의 리뷰 생성 */
router.post("/:drinkId/:userId", async (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.params.userId;
  const { review, imgUrl, isPublic } = req.body;

  Wish.create({
    drinkId: drinkId,
    userId: userId,
    review: review,
    imgUrl: imgUrl,
    isPublic: isPublic,
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ result: false });
      next(err);
    });
});

module.exports = router;
