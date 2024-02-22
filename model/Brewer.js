const mongoose = require("mongoose");

const brewerSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    address:{
        type: Number,
    },
    link:{
        type: String,
    },
    tel:{
        type: String,
    },
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});
brewerSchema.virtual('brewers',{
    ref: 'Drinks',
    localField: '_id',
    foreignField: 'brewerId'
});

const Brewer = mongoose.model("Brewer", brewerSchema);
module.exports = Brewer;