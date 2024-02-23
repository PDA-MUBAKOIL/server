const mongoose = require("mongoose");

const drinkSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    percent:{
        type: Number,
        require: true,
    },
    imgUrl:{
        type: String,
        require: true,
    },
    tags:{
        type: Array,
    },
    description:{
        type: String,
    },
    brewerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brewer",
    },
    region:{
        type: String,
        require: true,
    },
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

drinkSchema.virtual('wishdrink',{
    ref: 'Wish',
    localField: '_id',
    foreignField: 'drinkId'
});

const Drinks = mongoose.model("Drinks", drinkSchema);
module.exports = Drinks;