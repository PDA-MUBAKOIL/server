const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validator: [isEmail, "올바른 이메일 형식이 아닙니다."],
    },
    password:{
        type: String,
        require: true,
    },
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

usersSchema.virtual('wishuser',{
    ref: 'Wish',
    localField: '_id',
    foreignField: 'userId'
});

usersSchema.statics.signUp = async function(name, email, password)
{
    const salt  = await bcrypt.genSalt();
   
    try{
        // pw는 암호화 시켜서 저장
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.create({name, email, password:hashedPassword});
        return{
            _id: user._id,
            email: user.email,
            name: user.name,
        };
    } catch(err){
        throw err;
    }
};

usersSchema.statics.login = async function(email, password)
{
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user.visibleUser;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};


const visibleUser = usersSchema.virtual("visibleUser");
visibleUser.get(function(value, virtual, doc){
    return {
        _id: doc._id,
        email: doc.email,
        name: doc.name,
    };
});

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;