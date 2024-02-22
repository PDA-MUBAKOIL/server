const mongoose = require("mongoose");

const wishSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        require: true,
    },
    drinkId:{
        type: mongoose.Schema.Types,
        ref: "Drinks",
        require: true,
    },
    review:{
        type: String,
    },
    imgUrl:{
        type: String,
    },
    isPublic:{
        type: Boolean,
        default: true,
    },
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

const Wish = mongoose.model("Wish", wishSchema);
module.exports = Wish;