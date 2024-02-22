const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
    password:{
        type: String,
        require: true,
    },
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

usersSchema.virtual('users',{
    ref: 'Wish',
    localField: '_id',
    foreignField: 'userId'
});

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;