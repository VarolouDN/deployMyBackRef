const mongoose=require("mongoose")
const Schema = require("mongoose"),

    ObjectId = mongoose.Schema.ObjectId


const User = new mongoose.Schema({



        avatar: {type:String},
        name:{type:String,unique:true,required:true} ,
        isOnline: {type:Boolean},
        isAuth:{type:Boolean},
        email:{type:String,unique:true,required:true} ,
        password:{type:String,required:true} ,
       /* fullname:{type:String} ,*/
        confirmed: {type:Boolean},
        picture:{type:String}




    }


);
module.exports= mongoose.model("User",User)