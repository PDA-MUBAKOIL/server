var express = require("express");
var router = express.Router();
const Wish = require("../model/Wish");
const { verifyToken } = require("../utils/auth");

/* GET: 해당 술에 대한 전체 리뷰 조회 */
router.get("/review/:drinkId", function (req, res, next) {
    const drinkId = req.params.drinkId;
    Wish.find({ drinkId: drinkId }).then((data) => {
        res.json(data);
    }).catch((err) => {
        console.error(err);
        res.status(404).json({ result: false });
    });
});  

// authenticate 미들웨어 생성
async function authenticate(req, res, next) {
    // 토큰을 request에서 꺼내서 유저 정보 확인
    try {

        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
        }
  
        const user = verifyToken(token);
        req.user = user;
        // 유저 정보 없으면 error 발생
        if (!user) {
            res.status(401).json({ result: false, message: "Authorization Failed" });  
        }
        next(); //req.user가 넘겨짐

    } catch (error) {
        // 예외가 발생한 경우 처리할 내용
        res.json({ result: false, message:"not login state"});
    }
}

/* GET : 나의 위시에 있는 술 지역별 개수 조회 */
router. get('/regioncnt', authenticate, async function (req,res,next){
    try {
        const userId = req.user._id;
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
router.get("/", authenticate, async function (req, res, next) {
  try {
    const userId = req.user._id;
    console.log(req.user);
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


/* GET : 해당 술에 대한 나의 리뷰 조회 */
router.get("/:drinkId",authenticate, (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.user._id;

  Wish.findOne({
    drinkId: drinkId,
    userId: userId,
  }).populate("drinkId").then((data) => {
    res.json(data);
  }).catch((err) => {
    console.error(err);
    res.json({ result: false });
  });
});

/* DELETE : 해당 술에 대한 나의 리뷰 삭제 */
router.delete("/:drinkId", authenticate, async (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.user._id;

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
router.put("/:drinkId", authenticate, (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.user._id;
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
    });
});

/* POST : 해당 술에 대한 나의 리뷰 생성 */
router.post("/:drinkId", authenticate, async (req, res, next) => {
  const drinkId = req.params.drinkId;
  const userId = req.user._id;
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
    });
});

module.exports = router;
