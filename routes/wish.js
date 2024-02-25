var express = require("express");
var router = express.Router();
const Wish = require("../model/Wish");

/* GET: 해당 술에 대한 전체 리뷰 조회 */
router.get("/:drinkId", function (req, res, next) {
    const drinkId = req.params.drinkId;
  
    Wish.find({drinkId: drinkId}).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({ error: 'Wish does not get drink' });
        next(err);
    }); 
});

/* GET : 해당 술에 대한 나의 리뷰 조회 */
router.get("/:drinkId/:userId", (req, res, next)=>{
    const drinkId = req.params.drinkId;
    const userId = req.params.userId;

    Wish.findOne({
        drinkId: drinkId,
        userId: userId
    }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({ error: 'Wish does not get drink/user' });
        next(err);
    }); 
});

/* DELETE : 해당 술에 대한 나의 리뷰 삭제 */
router.delete("/:drinkId/:userId", async(req, res, next)=>{
    const drinkId = req.params.drinkId;
    const userId = req.params.userId;

    Wish.deleteOne({
        userId: userId,
        drinkId: drinkId
    }).catch(err=>{
        res.status(404).json({ error: 'Wish does not delete' });
        next(err);
    });
})

/* PUT : 해당 술에 대한 나의 리뷰 수정 */
router.put('/:drinkId/:userId',(req,res,next)=>{
    const drinkId = req.params.drinkId;
    const userId = req.params.userId;
    const {review, imgUrl, isPublic} = req.body;

    Wish.updateOne({
        drinkId: drinkId,
        userId: userId,
    }, {review, imgUrl, isPublic}
    ).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.status(404).json({ error: 'Wish does not put' });
        next(err);
    })
});

/* POST : 해당 술에 대한 나의 리뷰 생성 */
router. post('/:drinkId/:userId', async(req,res,next)=>{
    const drinkId = req.params.drinkId;
    const userId = req.params.userId;
    const {review, imgUrl, isPublic} = req.body;

    Wish.create({
        drinkId: drinkId,
        userId: userId,
        review: review,
        imgUrl: imgUrl,
        isPublic: isPublic
    }).then(data=>{
        res.json(data); 
    }).catch(err=>{
        res.status(404).json({ error: 'Wish does not post' });
        next(err)
    }) 
});

/* GET : 나의 위시 전체 조회 + 해당 지역별 위시 조회 */
router. get('/:userId', async(req,res,next)=>{
    const userId = req.params.userId;
    if(!req.query.region){
        Wish.find({userId:userId}).then(data=>{
            res.json(data);
        }).catch(err=>{
            res.status(404).json({ error: 'Wish does not get user' });
            next(err);
        });
    }
    else{
        Wish.find({userId:userId, region:req.query.region}).then(data=>{
            res.json(data);
        }).catch(err=>{
            res.status(404).json({ error: 'Wish does not get user' });
            next(err);
        });
    }
});

/* GET : 나의 위시에 있는 술 지역별 개수 조회 */
router. get('/:userId/regioncnt', async(req,res,next)=>{
    try {
        const userId = req.params.userId;

        // Use your ORM or database library to query the database
        const regionCounts = await Drink.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: '$region',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default MongoDB _id field
                    region: '$_id',
                    count: 1
                }
            }
        ]);

        // Construct the result object directly
        const result = {};
        regionCounts.forEach((regionCount) => {
            result[regionCount.region] = regionCount.count;
        });
        res.json(result);
        
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
});
module.exports = router;
