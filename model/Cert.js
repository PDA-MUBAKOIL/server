const mongoose = require("mongoose");
const { isEmail } = require("validator");


const certSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        lowercase: true,
        validator: [isEmail, "올바른 이메일 형식이 아닙니다."],
    },
    hashAuth:{
        type: String,
        require: true,
    },
    createAt:{
        type: Date,
        expires: 300, 
        default: Date.now,
    }
    
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

const Cert = mongoose.model("Cert", certSchema);
module.exports = Cert;