var express = require("express");
var router = express.Router();
const Wish = require("../model/Wish");
const Drinks = require("../model/Drinks");

/* GET : 나의 위시에 있는 술 지역별 개수 조회 */
router. get('/regioncnt', async function (req,res,next){
    try {
        const userId = req.body.userId;
        const region = req.query.region;

        // Define the main query to filter by userId
        const query = { userId: userId };

        // Define a subquery to match the region if provided
        const matchSubQuery = {};
        if (region) {
            matchSubQuery['region'] = region;
        }

        // Perform the search with populate and match
        const wishes = await Wish.find(query).populate({
            path: "drinkId",
            match: matchSubQuery,
        });

        // Filter out null values from populated field
        const filteredWishes = wishes.filter(wish => wish.drinkId !== null);

        // Count wishes for each region
        const regionCounts = filteredWishes.reduce((counts, wish) => {
            const wishRegion = wish.drinkId.region;
            counts[wishRegion] = (counts[wishRegion] || 0) + 1;
            return counts;
        }, {});

        res.status(200).json({ regionCount: regionCounts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false });
    }
});

/* GET : 나의 위시 전체 조회 + 해당 지역별 위시 조회 */
router.get("/", async function (req, res, next) {
  try {
    const userId = req.body.userId;
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
router.get("/:drinkId", (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.body.userId;

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
  const userId = req.body.userId;

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
  const userId = req.body.userId;
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
router.post("/:drinkId", async (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.body.userId;
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
